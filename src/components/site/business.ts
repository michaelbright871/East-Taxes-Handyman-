export const business = {
  name: "East Texas Handyman Services",
  shortName: "East Texas Handyman",
  phone: "+1 (469) 678-6244",
  phoneHref: "tel:+14696786244",
  smsHref: "sms:+14696786244?&body=Hi%2C%20I%27d%20like%20a%20free%20handyman%20estimate.",
  whatsappHref:
    "https://wa.me/14696786244?text=Hi%2C%20I%27d%20like%20a%20free%20handyman%20estimate.",

  street: "2505 Clinton St",
  city: "Longview",
  state: "Texas",
  stateCode: "TX",
  zip: "75604",
  country: "United States",
  get addressLine() {
    return `${this.street}, ${this.city}, ${this.stateCode} ${this.zip}`;
  },
  mapsEmbed:
    "https://www.google.com/maps?q=2505+Clinton+St,+Longview,+TX+75604&output=embed",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=2505+Clinton+St+Longview+TX+75604",
  mapsListing:
    "https://www.google.com/maps/search/?api=1&query=2505+Clinton+St+Longview+TX+75604",
  hours: "Mon – Sat: 7:00 AM – 6:00 PM",
};

export const serviceAreas = [
  "Longview",
  "Kilgore",
  "Gladewater",
  "White Oak",
  "Hallsville",
  "Marshall",
  "Tyler",
  "Henderson",
  "Big Sandy",
  "Lakeport",
  "Judson",
  "Diana",
];
