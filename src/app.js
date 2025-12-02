/**
 * Canton Realty XR - Main Application
 * 
 * WebXR Mixed Reality Real Estate Marketplace
 * Quest 3 optimized with hand tracking support
 */

// ============================================
// INITIALIZATION
// ============================================

let scene, camera, selectedProperty = null;
let isVRMode = false;

// Register custom A-Frame components immediately to avoid race conditions
registerAFrameComponents();

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Canton Realty XR Initializing...");
    
    // Get references
    scene = document.querySelector('#scene');
    camera = document.querySelector('#camera');
    
    // Initialize components
    await initializeApp();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1500);
});

async function initializeApp() {
    // Load Canton data
    const properties = await CantonAPI.getProperties();
    console.log(`📦 Loaded ${properties.length} properties from Canton Network`);

    // Wait for A-Frame scene to load before setting up interactions
    if (scene.hasLoaded) {
        console.log('🎬 A-Frame scene already loaded, setting up interactions...');
        setupPropertyInteractions();
    } else {
        scene.addEventListener('loaded', () => {
            console.log('🎬 A-Frame scene loaded, setting up interactions...');
            setupPropertyInteractions();
        });
    }

    // Setup other event listeners
    setupVRButton();
    setupUIEvents();
    setupVRInterface();

    // Start network status updates
    startNetworkMonitor();
}

// ============================================
// PROPERTY INTERACTIONS
// ============================================

function setupPropertyInteractions() {
    const properties = document.querySelectorAll('.property');
    console.log(`🏘️ Found ${properties.length} properties to set up interactions`);

    properties.forEach(prop => {
        // A-Frame fuse event (cursor-based selection)
        prop.addEventListener('click', (e) => {
            console.log('🖱️ Property entity clicked:', prop.id);
            handlePropertySelect(prop);
        });

        // Mouse enter/leave for visual feedback
        prop.addEventListener('mouseenter', (e) => {
            console.log('🖱️ Mouse entered property:', prop.id);
            highlightProperty(prop, true);
        });

        prop.addEventListener('mouseleave', (e) => {
            console.log('🖱️ Mouse left property:', prop.id);
            if (selectedProperty !== prop) {
                highlightProperty(prop, false);
            }
        });

        // VR/AR controller interaction
        prop.addEventListener('raycaster-intersected', (e) => {
            console.log('🎯 Raycaster intersected:', prop.id);
            highlightProperty(prop, true);
        });

        prop.addEventListener('raycaster-intersected-cleared', (e) => {
            if (selectedProperty !== prop) {
                highlightProperty(prop, false);
            }
        });
    });

    // Cursor-based interaction (primary method for A-Frame)
    const cursor = document.querySelector('#cursor');
    if (cursor) {
        console.log('✅ Cursor found, adding event listeners');

        // Click event on cursor
        cursor.addEventListener('click', (e) => {
            console.log('🖱️ Cursor clicked!', e);
            // Check if cursor is intersecting with a property
            const raycaster = cursor.components.raycaster;
            if (raycaster && raycaster.intersectedEls && raycaster.intersectedEls.length > 0) {
                const intersected = raycaster.intersectedEls[0];
                console.log('🎯 Cursor intersecting:', intersected.id, intersected.classList);
                if (intersected.classList.contains('property')) {
                    console.log('✅ Property detected via cursor!');
                    handlePropertySelect(intersected);
                }
            } else {
                console.log('⚠️ Cursor not intersecting anything');
            }
        });

        // Mouse enter (cursor hovering)
        cursor.addEventListener('mouseenter', (e) => {
            console.log('🖱️ Cursor mouse enter');
        });

        // Raycaster intersection
        cursor.addEventListener('raycaster-intersection', (e) => {
            console.log('🎯 Cursor raycaster-intersection:', e.detail.els);
        });

        cursor.addEventListener('raycaster-intersection-cleared', (e) => {
            console.log('🎯 Cursor raycaster-intersection-cleared');
        });
    } else {
        console.error('❌ Cursor not found!');
    }

    // Direct canvas click handler with manual raycasting
    const canvas = document.querySelector('a-scene canvas');
    const sceneEl = document.querySelector('a-scene');

    if (canvas && sceneEl) {
        console.log('🖱️ Adding canvas click listener with manual raycasting');

        canvas.addEventListener('click', (e) => {
            console.log('🖱️ Canvas clicked at:', e.clientX, e.clientY);

            // Get mouse position in normalized device coordinates (-1 to +1)
            const mouse = new THREE.Vector2();
            mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1;

            console.log('🖱️ Normalized mouse coords:', mouse.x, mouse.y);

            // Get camera
            const cameraEl = document.querySelector('#camera');
            if (cameraEl && cameraEl.object3D) {
                const raycaster = new THREE.Raycaster();
                
                // Find the actual THREE.Camera object
                let cameraObj = cameraEl.object3D;
                if (!cameraObj.isCamera) {
                    cameraObj = cameraEl.object3D.children.find(c => c.isCamera);
                }
                
                if (cameraObj) {
                    raycaster.setFromCamera(mouse, cameraObj);

                    // Get all property objects
                    const propertyObjects = [];
                    properties.forEach(prop => {
                        if (prop.object3D) {
                            propertyObjects.push(prop.object3D);
                        }
                    });

                console.log('🎯 Raycasting against', propertyObjects.length, 'properties');

                // Check for intersections
                const intersects = raycaster.intersectObjects(propertyObjects, true);

                console.log('🎯 Found', intersects.length, 'intersections');

                if (intersects.length > 0) {
                    // Find the property entity
                    let intersectedObject = intersects[0].object;
                    while (intersectedObject && !intersectedObject.el) {
                        intersectedObject = intersectedObject.parent;
                    }

                    if (intersectedObject && intersectedObject.el) {
                        let propertyEl = intersectedObject.el;
                        // Walk up to find the property entity
                        while (propertyEl && !propertyEl.classList.contains('property')) {
                            propertyEl = propertyEl.parentElement;
                        }

                        if (propertyEl && propertyEl.classList.contains('property')) {
                            console.log('✅ Property clicked via manual raycast:', propertyEl.id);
                            handlePropertySelect(propertyEl);
                        }
                    }
                }
            }
            }
        });
    }

    // Test: Log all click events on the scene
    if (sceneEl) {
        sceneEl.addEventListener('click', (e) => {
            console.log('🖱️ Scene clicked, target:', e.target.tagName);
        });
    }
}

async function handlePropertySelect(propertyEl) {
    const propertyId = propertyEl.getAttribute('data-property-id');
    console.log('🎯 Property selected:', propertyId);

    // Deselect previous
    if (selectedProperty && selectedProperty !== propertyEl) {
        highlightProperty(selectedProperty, false);
    }

    selectedProperty = propertyEl;
    highlightProperty(propertyEl, true);

    // Fetch property data
    const property = await CantonAPI.getProperty(propertyId);
    console.log('📊 Property data:', property);
    if (property) {
        // VR Mode Check
        if (isVRMode || (scene && scene.is('vr-mode'))) {
            updateVRPanel(property);
        } else {
            updatePropertyPanel(property);
            showPropertyPanel(true);
        }
        console.log('✅ Property panel shown');

        // Animate selection
        animatePropertySelection(propertyEl);

        // Play selection sound (if available)
        playSound('select');
    } else {
        console.error('❌ Property not found:', propertyId);
    }
}

function highlightProperty(propertyEl, isHighlighted) {
    const scale = isHighlighted ? '0.35 0.35 0.35' : '0.3 0.3 0.3';
    propertyEl.setAttribute('animation', {
        property: 'scale',
        to: scale,
        dur: 200,
        easing: 'easeOutQuad'
    });
}

function animatePropertySelection(propertyEl) {
    // Bounce animation
    const currentPos = propertyEl.getAttribute('position');
    propertyEl.setAttribute('animation__bounce', {
        property: 'position',
        to: `${currentPos.x} ${currentPos.y + 0.1} ${currentPos.z}`,
        dur: 150,
        easing: 'easeOutQuad',
        dir: 'alternate',
        loop: 1
    });
}

// ============================================
// VR UI MANAGEMENT
// ============================================

function updateVRPanel(property) {
    const vrPanel = document.querySelector('#vr-ui-panel');
    if (!vrPanel) return;

    // Update Text
    const title = document.querySelector('#vr-panel-title');
    const details = document.querySelector('#vr-panel-details');
    const tokens = document.querySelector('#vr-panel-tokens');

    if (title) title.setAttribute('value', property.name);
    if (details) details.setAttribute('value', 
        `${formatCurrency(property.valuation.pricePerToken)} | ${formatPercent(property.yields.annualYield)} Yield`);
    if (tokens) {
        tokens.setAttribute('value', `Available: ${formatNumber(property.token.availableTokens)}`);
        tokens.setAttribute('color', '#8899aa'); // Reset color
    }

    // Position Panel ABOVE the selected property
    if (selectedProperty && selectedProperty.object3D) {
        const propPos = new THREE.Vector3();
        selectedProperty.object3D.getWorldPosition(propPos);
        
        // Place panel 2.0m above the property center (better ergonomics)
        // Assuming property is roughly ground level or on a table
        propPos.y += 2.0; 
        
        console.log(`📍 Placing VR Panel above property at: ${propPos.x.toFixed(2)}, ${propPos.y.toFixed(2)}, ${propPos.z.toFixed(2)}`);

        // Apply position
        vrPanel.setAttribute('position', `${propPos.x} ${propPos.y} ${propPos.z}`);
        
        // Ensure panel faces camera
        if (!vrPanel.hasAttribute('look-at')) {
            vrPanel.setAttribute('look-at', '#camera');
        }
        
        // Force look-at update immediately
        const camera = document.querySelector('#camera');
        if (camera && camera.object3D) {
             const camPos = new THREE.Vector3();
             camera.object3D.getWorldPosition(camPos);
             vrPanel.object3D.lookAt(camPos);
        }
    }

    // Show Panel
    vrPanel.setAttribute('visible', 'true');
    
    // Re-setup interface interactions to ensure listeners are active
    setupVRInterface();
}

function setupVRInterface() {
    const investBtn = document.querySelector('#vr-btn-invest');
    const closeBtn = document.querySelector('#vr-btn-close');
    
    let isInvestProcessing = false;

    if (investBtn) {
        // Define handler
        const handleInvestClick = async () => {
             if (!selectedProperty || isInvestProcessing) return;
             
             const propertyId = selectedProperty.getAttribute('data-property-id');
             console.log("💰 Invest button clicked");
             
             // Lock interactions
             isInvestProcessing = true;
             investBtn.setAttribute('material', 'color', '#666666'); // Dim button
             investBtn.setAttribute('text', 'value', 'PROCESSING...'); // Update text if possible
             
             // Visual feedback on button (Press animation)
             investBtn.setAttribute('scale', '0.9 0.9 0.9'); 
             setTimeout(() => investBtn.setAttribute('scale', '1 1 1'), 150); 

             try {
                 const result = await CantonAPI.purchaseTokens(propertyId, 1);
                 
                 const tokensEl = document.querySelector('#vr-panel-tokens');
                 if (tokensEl) {
                     tokensEl.setAttribute('value', '✅ Purchased! Thank you.');
                     tokensEl.setAttribute('color', '#ffd700');
                 }
                 
                 celebrateInvestment();
                 
                 // Wait a bit before refreshing/unlocking
                 setTimeout(async () => {
                     const property = await CantonAPI.getProperty(propertyId);
                     updateVRPanel(property);
                     
                     // Unlock
                     isInvestProcessing = false;
                     investBtn.setAttribute('material', 'color', '#ffd700'); // Restore color
                     
                     // Restore original text if it was changed (assuming it's static "INVEST NOW")
                     const btnText = investBtn.querySelector('a-text');
                     if(btnText) btnText.setAttribute('value', 'INVEST NOW');
                     
                 }, 2500);
                 
             } catch (e) {
                 console.error(e);
                 const tokensEl = document.querySelector('#vr-panel-tokens');
                 if (tokensEl) {
                    tokensEl.setAttribute('value', '❌ Error: ' + e.message);
                    tokensEl.setAttribute('color', '#ff4444');
                 }
                 // Unlock on error
                 isInvestProcessing = false;
                 investBtn.setAttribute('material', 'color', '#ffd700');
                 const btnText = investBtn.querySelector('a-text');
                 if(btnText) btnText.setAttribute('value', 'INVEST NOW');
             }
        };

        // Attach listeners
        investBtn.onclick = handleInvestClick;
        investBtn.addEventListener('click', handleInvestClick);
        if (!investBtn.classList.contains('clickable')) investBtn.classList.add('clickable');
        
        // Hover effects (Mouse & VR Raycaster)
        const onHoverStart = () => { if(!isInvestProcessing) investBtn.setAttribute('material', 'color', '#ffcc00'); };
        const onHoverEnd = () => { if(!isInvestProcessing) investBtn.setAttribute('material', 'color', '#ffd700'); };
        
        investBtn.addEventListener('mouseenter', onHoverStart);
        investBtn.addEventListener('mouseleave', onHoverEnd);
        investBtn.addEventListener('raycaster-intersected', onHoverStart);
        investBtn.addEventListener('raycaster-intersected-cleared', onHoverEnd);
    }

    if (closeBtn) {
        const handleCloseClick = () => {
            console.log("❌ Close button clicked");
            const vrPanel = document.querySelector('#vr-ui-panel');
            if (vrPanel) vrPanel.setAttribute('visible', false);
            
            if (selectedProperty) {
                highlightProperty(selectedProperty, false);
                selectedProperty = null;
            }
            
            // Press animation
            closeBtn.setAttribute('scale', '0.9 0.9 0.9');
            setTimeout(() => closeBtn.setAttribute('scale', '1 1 1'), 150);
        };

        closeBtn.onclick = handleCloseClick;
        closeBtn.addEventListener('click', handleCloseClick);
        if (!closeBtn.classList.contains('clickable')) closeBtn.classList.add('clickable');
        
        // Hover effects
        const onCloseHoverStart = () => closeBtn.setAttribute('material', 'color', '#445566');
        const onCloseHoverEnd = () => closeBtn.setAttribute('material', 'color', '#334455');

        closeBtn.addEventListener('mouseenter', onCloseHoverStart);
        closeBtn.addEventListener('mouseleave', onCloseHoverEnd);
        closeBtn.addEventListener('raycaster-intersected', onCloseHoverStart);
        closeBtn.addEventListener('raycaster-intersected-cleared', onCloseHoverEnd);
    }
}

// ============================================
// UI PANEL MANAGEMENT
// ============================================

function updatePropertyPanel(property) {
    document.getElementById('panel-name').textContent = property.name;
    document.getElementById('panel-location').textContent = 
        `${property.location.district}, ${property.location.city}`;
    document.getElementById('panel-price').textContent = 
        formatCurrency(property.valuation.totalValue);
    document.getElementById('panel-yield').textContent = 
        formatPercent(property.yields.annualYield);
    document.getElementById('panel-tokens').textContent = 
        formatNumber(property.token.availableTokens);
    
    // Update invest button state
    const investBtn = document.querySelector('.invest-btn');
    if (property.token.availableTokens === 0) {
        investBtn.textContent = 'Sold Out';
        investBtn.disabled = true;
        investBtn.style.background = '#666';
    } else {
        investBtn.textContent = 'Invest Now';
        investBtn.disabled = false;
        investBtn.style.background = '';
    }
}

function showPropertyPanel(show) {
    const panel = document.getElementById('property-panel');
    if (show) {
        panel.classList.add('visible');
    } else {
        panel.classList.remove('visible');
    }
}

// ============================================
// INVESTMENT FLOW
// ============================================

async function handleInvest() {
    if (!selectedProperty) return;
    
    const propertyId = selectedProperty.getAttribute('data-property-id');
    const property = await CantonAPI.getProperty(propertyId);
    
    // Check compliance first
    const compliance = await CantonAPI.checkCompliance(propertyId, 'current-user');
    if (!compliance.eligible) {
        showNotification(`Cannot invest: ${compliance.reason}`, 'error');
        return;
    }
    
    // Show investment modal
    showInvestmentModal(property);
}

function showInvestmentModal(property) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'invest-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeInvestmentModal()"></div>
        <div class="modal-content">
            <h2>Invest in ${property.name}</h2>
            <div class="modal-info">
                <div class="info-row">
                    <span>Price per Token:</span>
                    <strong>${formatCurrency(property.valuation.pricePerToken)}</strong>
                </div>
                <div class="info-row">
                    <span>Available Tokens:</span>
                    <strong>${formatNumber(property.token.availableTokens)}</strong>
                </div>
                <div class="info-row">
                    <span>Expected Yield:</span>
                    <strong>${formatPercent(property.yields.annualYield)} APY</strong>
                </div>
            </div>
            <div class="token-input">
                <label>Number of Tokens:</label>
                <input type="number" id="token-amount" min="1" max="${property.token.maxInvestment}" value="1">
                <div class="total-cost">
                    Total: <span id="total-cost">${formatCurrency(property.valuation.pricePerToken)}</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeInvestmentModal()">Cancel</button>
                <button class="btn-confirm" onclick="confirmInvestment('${property.id}')">
                    Confirm Investment
                </button>
            </div>
            <div class="canton-badge">
                <span class="canton-icon">🔒</span>
                Secured by Canton Network
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        #invest-modal {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
        }
        .modal-content {
            position: relative;
            background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%);
            border: 1px solid rgba(0, 212, 170, 0.3);
            border-radius: 20px;
            padding: 2rem;
            width: 90%;
            max-width: 420px;
            animation: modalIn 0.3s ease;
        }
        @keyframes modalIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .modal-content h2 {
            color: #00d4aa;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }
        .modal-info {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            color: #8899aa;
        }
        .info-row strong {
            color: #fff;
            font-family: 'Space Mono', monospace;
        }
        .token-input {
            margin-bottom: 1.5rem;
        }
        .token-input label {
            display: block;
            margin-bottom: 0.5rem;
            color: #8899aa;
        }
        .token-input input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #fff;
            font-family: 'Space Mono', monospace;
            font-size: 1.25rem;
            text-align: center;
        }
        .token-input input:focus {
            outline: none;
            border-color: #00d4aa;
        }
        .total-cost {
            text-align: center;
            margin-top: 0.75rem;
            font-size: 1.1rem;
            color: #ffd700;
        }
        .total-cost span {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
        }
        .modal-actions {
            display: flex;
            gap: 1rem;
        }
        .btn-cancel, .btn-confirm {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 10px;
            font-family: 'Instrument Sans', sans-serif;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn-cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #8899aa;
        }
        .btn-confirm {
            background: linear-gradient(135deg, #00d4aa, #00a888);
            color: #0a1628;
        }
        .btn-cancel:hover, .btn-confirm:hover {
            transform: translateY(-2px);
        }
        .canton-badge {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #8899aa;
            font-size: 0.85rem;
        }
        .canton-icon {
            margin-right: 0.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Update total on input change
    const input = document.getElementById('token-amount');
    const totalEl = document.getElementById('total-cost');
    input.addEventListener('input', () => {
        const tokens = parseInt(input.value) || 0;
        totalEl.textContent = formatCurrency(tokens * property.valuation.pricePerToken);
    });
}

function closeInvestmentModal() {
    const modal = document.getElementById('invest-modal');
    if (modal) {
        modal.remove();
    }
}

async function confirmInvestment(propertyId) {
    const tokenAmount = parseInt(document.getElementById('token-amount').value);
    
    if (!tokenAmount || tokenAmount < 1) {
        showNotification('Please enter a valid token amount', 'error');
        return;
    }
    
    // Show processing state
    const confirmBtn = document.querySelector('.btn-confirm');
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;
    
    try {
        const result = await CantonAPI.purchaseTokens(propertyId, tokenAmount);
        
        closeInvestmentModal();
        
        // Show success
        showNotification(
            `Successfully purchased ${tokenAmount} tokens!<br>
            <small>TX: ${result.transactionId.slice(0, 20)}...</small>`,
            'success'
        );
        
        // Celebrate!
        celebrateInvestment();
        
        // Refresh property data
        const property = await CantonAPI.getProperty(propertyId);
        updatePropertyPanel(property);
        
    } catch (error) {
        showNotification(`Transaction failed: ${error.message}`, 'error');
        confirmBtn.textContent = 'Confirm Investment';
        confirmBtn.disabled = false;
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    const colors = {
        success: '#00d4aa',
        error: '#ff4466',
        info: '#4488ff'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 22, 40, 0.95);
        border: 1px solid ${colors[type]};
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 3000;
        animation: slideDown 0.3s ease;
        text-align: center;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// ============================================
// CELEBRATION EFFECT
// ============================================

function celebrateInvestment() {
    // Create particle explosion in A-Frame
    const particles = document.getElementById('canton-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('a-sphere');
        const angle = (Math.PI * 2 * i) / 20;
        const radius = 0.5 + Math.random() * 1;
        
        particle.setAttribute('radius', 0.02 + Math.random() * 0.03);
        particle.setAttribute('material', {
            color: Math.random() > 0.5 ? '#00d4aa' : '#ffd700',
            emissive: Math.random() > 0.5 ? '#00d4aa' : '#ffd700',
            emissiveIntensity: 0.8
        });
        particle.setAttribute('position', {
            x: 0,
            y: 1.5,
            z: -2
        });
        particle.setAttribute('animation', {
            property: 'position',
            to: `${Math.cos(angle) * radius} ${1.5 + Math.random() * 2} ${-2 + Math.sin(angle) * radius}`,
            dur: 1000 + Math.random() * 500,
            easing: 'easeOutQuad'
        });
        particle.setAttribute('animation__fade', {
            property: 'material.opacity',
            from: 1,
            to: 0,
            dur: 1500,
            delay: 500
        });
        
        particles.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => particle.remove(), 2000);
    }
}

// ============================================
// VR MODE
// ============================================

function setupVRButton() {
    const vrBtn = document.getElementById('enter-vr-btn');
    
    // Check WebXR support
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-ar').then(supported => {
            if (supported) {
                vrBtn.textContent = 'Enter Mixed Reality';
                vrBtn.addEventListener('click', enterVR);
            } else {
                // Try VR mode
                navigator.xr.isSessionSupported('immersive-vr').then(vrSupported => {
                    if (vrSupported) {
                        vrBtn.textContent = 'Enter VR';
                        vrBtn.addEventListener('click', enterVR);
                    } else {
                        vrBtn.textContent = '3D View';
                        vrBtn.disabled = false;
                    }
                });
            }
        });
    } else {
        vrBtn.textContent = '3D View';
        vrBtn.disabled = false;
    }
}

function enterVR() {
    try {
        scene.enterVR();
        isVRMode = true;
        
        // Hide 2D UI elements in VR
        document.getElementById('ui-overlay').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        showPropertyPanel(false);
    } catch (err) {
        console.error("Failed to enter VR:", err);
        showNotification("Failed to enter VR: " + err.message, 'error');
    }
}

// Listen for VR state changes
document.addEventListener('DOMContentLoaded', () => {
    scene = document.querySelector('#scene');
    if (scene) {
        scene.addEventListener('enter-vr', () => {
            console.log("👓 VR Mode Entered (Event)");
            isVRMode = true;
            // Hide 2D UI elements
            const ui = document.getElementById('ui-overlay');
            const instructions = document.getElementById('instructions');
            const panel = document.getElementById('property-panel');
            
            if (ui) ui.style.display = 'none';
            if (instructions) instructions.style.display = 'none';
            if (panel) panel.classList.remove('visible');
        });

        scene.addEventListener('exit-vr', () => {
            console.log("👋 VR Mode Exited (Event)");
            isVRMode = false;
            // Show 2D UI elements
            const ui = document.getElementById('ui-overlay');
            const instructions = document.getElementById('instructions');
            
            if (ui) ui.style.display = 'flex';
            if (instructions) instructions.style.display = 'block';
            // Property panel stays hidden until selected again
        });
    }
});

// ============================================
// UI EVENTS
// ============================================

function setupUIEvents() {
    // Click outside to deselect
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.property') && 
            !e.target.closest('#property-panel') &&
            !e.target.closest('#invest-modal')) {
            // Don't deselect if clicking A-Frame scene
            if (e.target.tagName !== 'A-SCENE' && !e.target.closest('a-scene')) {
                if (selectedProperty) {
                    highlightProperty(selectedProperty, false);
                    selectedProperty = null;
                    showPropertyPanel(false);
                }
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInvestmentModal();
            if (selectedProperty) {
                highlightProperty(selectedProperty, false);
                selectedProperty = null;
                showPropertyPanel(false);
            }
        }
    });
}

// ============================================
// NETWORK MONITOR
// ============================================

function startNetworkMonitor() {
    // Update network status periodically
    setInterval(async () => {
        const status = await CantonAPI.getNetworkStatus();
        // Could update UI with block height, etc.
        console.log(`Canton Block: ${status.blockHeight}`);
    }, 10000);
}

// ============================================
// A-FRAME CUSTOM COMPONENTS
// ============================================

function registerAFrameComponents() {
    // Component for billboard effect (always face camera)
    AFRAME.registerComponent('look-at', {
        schema: { type: 'selector' },
        
        init: function() {
            this.target = this.data;
        },
        
        tick: function() {
            // Retry finding target if missing (e.g. loaded later)
            if (!this.target) {
                this.target = this.data;
                // Fallback to camera if no selector provided or not found
                if (!this.target) {
                    this.target = this.el.sceneEl.camera ? this.el.sceneEl.camera.el : document.querySelector('[camera]');
                }
            }

            if (this.target && this.target.object3D) {
                // Look at target (usually camera)
                // We use the world position to ensure correct rotation even if parents are rotated
                const targetPos = new THREE.Vector3();
                this.target.object3D.getWorldPosition(targetPos);
                this.el.object3D.lookAt(targetPos);
            }
        }
    });

    // Component for XR interaction feedback
    AFRAME.registerComponent('xr-interactable', {
        init: function() {
            this.el.addEventListener('selectstart', () => {
                handlePropertySelect(this.el);
            });
        }
    });



    // Component for clickable properties (desktop cursor)
    AFRAME.registerComponent('clickable', {
        init: function() {
            console.log('📌 Clickable component initialized for:', this.el.id);
            this.el.classList.add('clickable');

            this.el.addEventListener('click', () => {
                console.log('🖱️ Click event fired for:', this.el.id);
                handlePropertySelect(this.el);
            });

            this.el.addEventListener('mouseenter', () => {
                highlightProperty(this.el, true);
            });

            this.el.addEventListener('mouseleave', () => {
                if (selectedProperty !== this.el) {
                    highlightProperty(this.el, false);
                }
            });
        }
    });

    // Component for controller interaction (Quest trigger)
    AFRAME.registerComponent('controller-interaction', {
        init: function() {
            console.log('🎮 Controller interaction component initialized for', this.el.id);
            
            this.intersectedEl = null;

            // Helper to find valid target in intersection list
            const findValidTarget = (els) => {
                if (!els) return null;
                for (let i = 0; i < els.length; i++) {
                    const el = els[i];
                    // Ignore self (controller) and non-interactive objects
                    if (el.id && (el.id.includes('hand') || el.id.includes('controller'))) continue;
                    
                    if (el.classList.contains('property') || el.classList.contains('clickable')) {
                        return el;
                    }
                }
                return null;
            };

            // Track intersections
            this.el.addEventListener('raycaster-intersection', (e) => {
                const valid = findValidTarget(e.detail.els);
                if (valid) {
                    this.intersectedEl = valid;
                    // console.log('🔦 Raycaster Hit Valid:', valid.id);
                }
            });
            
            this.el.addEventListener('raycaster-intersection-cleared', () => {
                // Only clear if we aren't hitting anything valid anymore
                // Actually, cleared event doesn't give us the new state easily, 
                // but usually means "no longer hitting THE object".
                // Safer to just clear and let next intersection event set it.
                this.intersectedEl = null;
            });

            // Get parent controller if this is on the raycaster child
            const controller = this.el.parentElement;

            // Listen for trigger on parent controller
            const handleTrigger = () => {
                console.log('🔫 Trigger pressed on', controller ? controller.id : this.el.id);
                
                let targetEl = this.intersectedEl;
                
                // Fallback check
                if (!targetEl && this.el.components.raycaster) {
                    targetEl = findValidTarget(this.el.components.raycaster.intersectedEls);
                    if (targetEl) console.log('🔦 Recovered target from direct raycaster access');
                }

                if (targetEl) {
                    console.log('🎯 Trigger HIT:', targetEl.id, targetEl.className);
                    
                    // 1. Dispatch standard 'click' event
                    targetEl.dispatchEvent(new Event('click'));
                    
                    // 2. Explicitly call onclick handler
                    if (targetEl.onclick) {
                        console.log('⚡ Executing onclick handler directly');
                        targetEl.onclick();
                    }
                    
                    // 3. Special handling for properties
                    if (targetEl.classList.contains('property')) {
                        console.log('✅ Property hit detected via trigger');
                        handlePropertySelect(targetEl);
                    }
                } else {
                    console.log('⚠️ Trigger pressed but NO VALID target found (ignored self/environment)');
                }
            };

            // Listen on both the controller and this element
            if (controller) {
                controller.addEventListener('triggerdown', handleTrigger);
            }
            this.el.addEventListener('triggerdown', handleTrigger);
        }
    });
}

// ============================================
// SOUND EFFECTS (Optional)
// ============================================

const sounds = {};

function playSound(name) {
    // Sound effects disabled for now to reduce complexity
    // Could add Web Audio API sounds here
}

// ============================================
// EXPOSE GLOBAL FUNCTIONS
// ============================================

window.handleInvest = handleInvest;
window.closeInvestmentModal = closeInvestmentModal;
window.confirmInvestment = confirmInvestment;

console.log("✅ Canton Realty XR Application Ready");