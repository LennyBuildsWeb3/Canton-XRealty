/**
 * Mock Canton Network Data
 * 
 * Bu dosya, Canton Network'ten gelecek gerçek verilerin simülasyonunu içerir.
 * Production'da bu veriler DAML smart contract'lardan çekilecektir.
 * 
 * Canton Network Özellikleri (Demo için simüle edilen):
 * - Privacy: Yalnızca yetkili yatırımcılar token bilgilerini görebilir
 * - Compliance: KYC/AML onaylı yatırımcı listesi
 * - Atomic Transactions: Güvenli token transferleri
 */

const CANTON_MOCK_DATA = {
    // Network Status
    network: {
        name: "Canton Network",
        status: "connected",
        blockHeight: 1847293,
        lastSync: new Date().toISOString(),
        participants: ["Manhattan RE Trust", "Global Investors DAO", "Compliance Node US"],
        privacyMode: "permissioned"
    },

    // Tokenized Properties
    properties: {
        "prop-001": {
            // Property Details
            id: "prop-001",
            name: "Central Park Penthouse",
            type: "Residential - Luxury",
            location: {
                city: "New York",
                district: "Upper West Side",
                country: "United States",
                coordinates: { lat: 40.7794, lng: -73.9632 }
            },
            description: "Luxury penthouse with Central Park views. 4 bedrooms, 3,200 sq ft, full amenities.",

            // Financial Data
            valuation: {
                totalValue: 3200000,
                currency: "USD",
                pricePerToken: 1000,
                lastAppraisal: "2024-12-15",
                appraiser: "Cushman & Wakefield"
            },

            // Token Information
            token: {
                contractId: "canton:manhattan-re-001:central-park-penthouse",
                symbol: "CPPH",
                totalSupply: 3200,
                availableTokens: 2240,
                soldTokens: 960,
                minInvestment: 1, // 1 token minimum
                maxInvestment: 320 // Max 10% per investor
            },

            // Yield & Returns
            yields: {
                annualYield: 8.5,
                monthlyRent: 22667,
                occupancyRate: 100,
                lastDistribution: "2024-12-01",
                nextDistribution: "2025-01-01",
                historicalReturns: [
                    { year: 2022, return: 8.1 },
                    { year: 2023, return: 8.8 },
                    { year: 2024, return: 8.5 }
                ]
            },

            // Compliance (Canton Privacy Feature)
            compliance: {
                status: "verified",
                kycRequired: true,
                accreditedOnly: true,
                jurisdictions: ["US", "EU", "UK", "TR"],
                legalEntity: "Central Park RE SPV LLC",
                regulatoryApprovals: ["SEC-Reg-D", "FINRA"]
            },
            
            // Documents (Would be stored encrypted on Canton)
            documents: {
                titleDeed: { hash: "0x7f8a...", verified: true },
                appraisalReport: { hash: "0x3c2d...", verified: true },
                insuranceCert: { hash: "0x9e1b...", verified: true },
                rentalAgreement: { hash: "0x4a7c...", verified: true }
            },
            
            // 3D Model Reference
            model: {
                type: "procedural", // For demo, we use procedural A-Frame geometry
                scale: 0.3,
                position: { x: -1.5, y: 0.5, z: -2 }
            }
        },

        "prop-002": {
            id: "prop-002",
            name: "Hudson Yards Tower",
            type: "Residential - Apartment",
            location: {
                city: "New York",
                district: "Hudson Yards",
                country: "United States",
                coordinates: { lat: 40.7536, lng: -74.0014 }
            },
            description: "Modern luxury apartment in Hudson Yards. 2 bed, 1,850 sq ft, amenities included.",

            valuation: {
                totalValue: 1200000,
                currency: "USD",
                pricePerToken: 500,
                lastAppraisal: "2024-11-20",
                appraiser: "JLL Americas"
            },

            token: {
                contractId: "canton:manhattan-re-001:hudson-yards-tower",
                symbol: "HYRD",
                totalSupply: 2400,
                availableTokens: 1200,
                soldTokens: 1200,
                minInvestment: 1,
                maxInvestment: 240
            },

            yields: {
                annualYield: 6.8,
                monthlyRent: 6800,
                occupancyRate: 100,
                lastDistribution: "2024-12-01",
                nextDistribution: "2025-01-01",
                historicalReturns: [
                    { year: 2022, return: 6.2 },
                    { year: 2023, return: 6.5 },
                    { year: 2024, return: 6.8 }
                ]
            },

            compliance: {
                status: "verified",
                kycRequired: true,
                accreditedOnly: false,
                jurisdictions: ["US", "EU", "TR"],
                legalEntity: "Hudson Yards RE SPV LLC",
                regulatoryApprovals: ["SEC-Reg-D"]
            },
            
            documents: {
                titleDeed: { hash: "0x2a3f...", verified: true },
                appraisalReport: { hash: "0x8b4e...", verified: true },
                insuranceCert: { hash: "0x1d5c...", verified: true }
            },
            
            model: {
                type: "procedural",
                scale: 0.3,
                position: { x: 0, y: 0.5, z: -2.5 }
            }
        },

        "prop-003": {
            id: "prop-003",
            name: "Wall Street Plaza",
            type: "Commercial - Office",
            location: {
                city: "New York",
                district: "Financial District",
                country: "United States",
                coordinates: { lat: 40.7074, lng: -74.0113 }
            },
            description: "Class A office building in Financial District. 35,000 sq ft, fully leased.",

            valuation: {
                totalValue: 6500000,
                currency: "USD",
                pricePerToken: 2000,
                lastAppraisal: "2024-10-30",
                appraiser: "CBRE Group"
            },

            token: {
                contractId: "canton:manhattan-re-001:wall-street-plaza",
                symbol: "WSPL",
                totalSupply: 3250,
                availableTokens: 1300,
                soldTokens: 1950,
                minInvestment: 1,
                maxInvestment: 325
            },

            yields: {
                annualYield: 9.3,
                monthlyRent: 50375,
                occupancyRate: 100,
                lastDistribution: "2024-12-01",
                nextDistribution: "2025-01-01",
                historicalReturns: [
                    { year: 2022, return: 8.7 },
                    { year: 2023, return: 9.0 },
                    { year: 2024, return: 9.3 }
                ]
            },

            compliance: {
                status: "verified",
                kycRequired: true,
                accreditedOnly: true, // Only accredited investors
                jurisdictions: ["US", "EU", "UK", "SG", "TR"],
                legalEntity: "Wall Street Commercial RE SPV LLC",
                regulatoryApprovals: ["SEC-Reg-D", "FINRA", "FinCEN"]
            },
            
            documents: {
                titleDeed: { hash: "0x5f2a...", verified: true },
                appraisalReport: { hash: "0x7c8d...", verified: true },
                insuranceCert: { hash: "0x3e9f...", verified: true },
                tenantContracts: { hash: "0x6b1a...", verified: true },
                buildingPermit: { hash: "0x9d4c...", verified: true }
            },
            
            model: {
                type: "procedural",
                scale: 0.3,
                position: { x: 1.5, y: 0.5, z: -2 }
            }
        }
    },

    // Mock User (Accredited Investor)
    currentUser: {
        id: "investor-001",
        name: "Demo Investor",
        walletAddress: "canton:investor:demo-001",
        kycStatus: "verified",
        accreditedStatus: true,
        jurisdiction: "TR",
        portfolio: {
            "prop-001": { tokens: 10, investedAmount: 10000, purchaseDate: "2024-06-15" },
            "prop-003": { tokens: 5, investedAmount: 10000, purchaseDate: "2024-08-20" }
        },
        totalInvested: 20000,
        totalYieldEarned: 1640
    },

    // Transaction History (Mock)
    recentTransactions: [
        {
            id: "tx-001",
            type: "purchase",
            propertyId: "prop-001",
            tokens: 5,
            amount: 5000,
            timestamp: "2024-12-20T14:32:00Z",
            status: "confirmed",
            cantonTxHash: "canton:tx:0x8f3a2b..."
        },
        {
            id: "tx-002",
            type: "dividend",
            propertyId: "prop-003",
            amount: 380,
            timestamp: "2024-12-01T00:00:00Z",
            status: "confirmed",
            cantonTxHash: "canton:tx:0x2c7d1e..."
        }
    ]
};

// Helper Functions (Simulating Canton API calls)
const CantonAPI = {
    /**
     * Get all available properties
     */
    getProperties: async function() {
        // Simulate network delay
        await this._delay(100);
        return Object.values(CANTON_MOCK_DATA.properties);
    },

    /**
     * Get single property by ID
     */
    getProperty: async function(propertyId) {
        await this._delay(50);
        return CANTON_MOCK_DATA.properties[propertyId] || null;
    },

    /**
     * Get current user data
     */
    getCurrentUser: async function() {
        await this._delay(50);
        return CANTON_MOCK_DATA.currentUser;
    },

    /**
     * Get network status
     */
    getNetworkStatus: async function() {
        await this._delay(30);
        return {
            ...CANTON_MOCK_DATA.network,
            blockHeight: CANTON_MOCK_DATA.network.blockHeight + Math.floor(Math.random() * 10)
        };
    },

    /**
     * Simulate token purchase
     */
    purchaseTokens: async function(propertyId, tokenAmount) {
        await this._delay(2000); // Simulate blockchain confirmation
        
        const property = CANTON_MOCK_DATA.properties[propertyId];
        if (!property) throw new Error("Property not found");
        
        if (tokenAmount > property.token.availableTokens) {
            throw new Error("Insufficient tokens available");
        }

        // Update mock state
        property.token.availableTokens -= tokenAmount;
        property.token.soldTokens += tokenAmount;
        
        // Update user portfolio
        const user = CANTON_MOCK_DATA.currentUser;
        if (!user.portfolio[propertyId]) {
            user.portfolio[propertyId] = { 
                tokens: 0, 
                investedAmount: 0, 
                purchaseDate: new Date().toISOString().split('T')[0] 
            };
        }
        user.portfolio[propertyId].tokens += tokenAmount;
        user.portfolio[propertyId].investedAmount += (tokenAmount * property.valuation.pricePerToken);

        // Mock successful transaction
        return {
            success: true,
            transactionId: `canton:tx:${Date.now().toString(16)}`,
            propertyId: propertyId,
            tokens: tokenAmount,
            totalCost: tokenAmount * property.valuation.pricePerToken,
            timestamp: new Date().toISOString(),
            message: "Transaction confirmed on Canton Network"
        };
    },

    /**
     * Verify investor compliance
     */
    checkCompliance: async function(propertyId, investorId) {
        await this._delay(100);
        
        const property = CANTON_MOCK_DATA.properties[propertyId];
        const user = CANTON_MOCK_DATA.currentUser;
        
        // Check accredited requirement
        if (property.compliance.accreditedOnly && !user.accreditedStatus) {
            return { eligible: false, reason: "Accredited investor status required" };
        }
        
        // Check jurisdiction
        if (!property.compliance.jurisdictions.includes(user.jurisdiction)) {
            return { eligible: false, reason: "Investment not available in your jurisdiction" };
        }
        
        return { eligible: true, reason: null };
    },

    // Internal delay helper
    _delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Format helpers
const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
};

const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Export for use in main app
window.CANTON_MOCK_DATA = CANTON_MOCK_DATA;
window.CantonAPI = CantonAPI;
window.formatCurrency = formatCurrency;
window.formatPercent = formatPercent;
window.formatNumber = formatNumber;

console.log("🏛️ Canton Network Mock Data Initialized");
console.log(`📊 ${Object.keys(CANTON_MOCK_DATA.properties).length} properties loaded`);
