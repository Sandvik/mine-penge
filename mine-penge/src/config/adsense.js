// AdSense Configuration
// Erstat disse værdier med dine egne fra Google AdSense dashboard

export const AD_SENSE_CONFIG = {
  // Din publisher ID fra AdSense (f.eks. ca-pub-1234567890123456)
  publisherId: 'ca-pub-YOUR_PUBLISHER_ID',
  
  // Ad slot IDs fra AdSense dashboard
  adSlots: {
    // Banner øverst på siden
    topBanner: 'YOUR_AD_SLOT_ID',
    
    // Banner nederst på siden
    bottomBanner: 'YOUR_AD_SLOT_ID_2',
    
    // Sidebar annonce (hvis du vil tilføje en senere)
    sidebar: 'YOUR_AD_SLOT_ID_3',
    
    // Mellem artikler (hvis du vil tilføje en senere)
    inContent: 'YOUR_AD_SLOT_ID_4'
  },
  
  // AdSense indstillinger
  settings: {
    // Automatisk formatering
    adFormat: 'auto',
    
    // Responsivt design
    fullWidthResponsive: true,
    
    // Test mode (sæt til false når du går live)
    testMode: true
  }
};

// Hjælpefunktion til at få publisher ID
export const getPublisherId = () => {
  return AD_SENSE_CONFIG.publisherId;
};

// Hjælpefunktion til at få ad slot ID
export const getAdSlot = (slotName) => {
  return AD_SENSE_CONFIG.adSlots[slotName];
}; 