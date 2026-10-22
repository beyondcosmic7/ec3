/**
 * Eskort Creations — Indian Pincode, Logistics & GST Split Service
 * Section 8.7 & Section 9.1 of BUILD_PROMPT.md
 */

export interface PincodeInfo {
  valid: boolean;
  pincode: string;
  city: string;
  state: string;
  stateCode: string;
  isRajasthan: boolean;
  etaDays: string;
  codAvailable: boolean;
}

// 2-digit prefix mapping to Indian State and Region
const PIN_PREFIX_MAP: Record<string, { state: string; stateCode: string; defaultCity: string }> = {
  "11": { state: "Delhi", stateCode: "DL", defaultCity: "New Delhi" },
  "12": { state: "Haryana", stateCode: "HR", defaultCity: "Gurugram / Faridabad" },
  "13": { state: "Haryana", stateCode: "HR", defaultCity: "Ambala / Karnal" },
  "14": { state: "Punjab", stateCode: "PB", defaultCity: "Ludhiana / Jalandhar" },
  "15": { state: "Punjab", stateCode: "PB", defaultCity: "Bathinda" },
  "16": { state: "Chandigarh", stateCode: "CH", defaultCity: "Chandigarh" },
  "17": { state: "Himachal Pradesh", stateCode: "HP", defaultCity: "Shimla" },
  "18": { state: "Jammu and Kashmir", stateCode: "JK", defaultCity: "Jammu" },
  "19": { state: "Jammu and Kashmir", stateCode: "JK", defaultCity: "Srinagar" },
  "20": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Noida / Aligarh" },
  "21": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Prayagraj" },
  "22": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Lucknow" },
  "23": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Varanasi" },
  "24": { state: "Uttarakhand", stateCode: "UK", defaultCity: "Dehradun" },
  "25": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Meerut" },
  "26": { state: "Uttarakhand", stateCode: "UK", defaultCity: "Nainital / Bareilly" },
  "27": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Gorakhpur" },
  "28": { state: "Uttar Pradesh", stateCode: "UP", defaultCity: "Agra / Jhansi" },
  "30": { state: "Rajasthan", stateCode: "RJ", defaultCity: "Jaipur" },
  "31": { state: "Rajasthan", stateCode: "RJ", defaultCity: "Udaipur / Bhilwara" },
  "32": { state: "Rajasthan", stateCode: "RJ", defaultCity: "Kota / Alwar" },
  "33": { state: "Rajasthan", stateCode: "RJ", defaultCity: "Bikaner / Sikar" },
  "34": { state: "Rajasthan", stateCode: "RJ", defaultCity: "Jodhpur / Pali" },
  "36": { state: "Gujarat", stateCode: "GJ", defaultCity: "Rajkot" },
  "37": { state: "Gujarat", stateCode: "GJ", defaultCity: "Kutch / Jamnagar" },
  "38": { state: "Gujarat", stateCode: "GJ", defaultCity: "Ahmedabad / Gandhinagar" },
  "39": { state: "Gujarat", stateCode: "GJ", defaultCity: "Surat / Vadodara" },
  "40": { state: "Maharashtra", stateCode: "MH", defaultCity: "Mumbai" },
  "41": { state: "Maharashtra", stateCode: "MH", defaultCity: "Pune" },
  "42": { state: "Maharashtra", stateCode: "MH", defaultCity: "Nashik" },
  "43": { state: "Maharashtra", stateCode: "MH", defaultCity: "Aurangabad" },
  "44": { state: "Maharashtra", stateCode: "MH", defaultCity: "Nagpur" },
  "45": { state: "Madhya Pradesh", stateCode: "MP", defaultCity: "Indore" },
  "46": { state: "Madhya Pradesh", stateCode: "MP", defaultCity: "Bhopal" },
  "47": { state: "Madhya Pradesh", stateCode: "MP", defaultCity: "Gwalior" },
  "48": { state: "Madhya Pradesh", stateCode: "MP", defaultCity: "Jabalpur" },
  "49": { state: "Chhattisgarh", stateCode: "CG", defaultCity: "Raipur" },
  "50": { state: "Telangana", stateCode: "TS", defaultCity: "Hyderabad" },
  "51": { state: "Andhra Pradesh", stateCode: "AP", defaultCity: "Tirupati" },
  "52": { state: "Andhra Pradesh", stateCode: "AP", defaultCity: "Vijayawada" },
  "53": { state: "Andhra Pradesh", stateCode: "AP", defaultCity: "Visakhapatnam" },
  "56": { state: "Karnataka", stateCode: "KA", defaultCity: "Bengaluru" },
  "57": { state: "Karnataka", stateCode: "KA", defaultCity: "Mangaluru" },
  "58": { state: "Karnataka", stateCode: "KA", defaultCity: "Hubballi / Belagavi" },
  "59": { state: "Karnataka", stateCode: "KA", defaultCity: "Mysuru" },
  "60": { state: "Tamil Nadu", stateCode: "TN", defaultCity: "Chennai" },
  "61": { state: "Tamil Nadu", stateCode: "TN", defaultCity: "Tiruchirappalli" },
  "62": { state: "Tamil Nadu", stateCode: "TN", defaultCity: "Madurai" },
  "63": { state: "Tamil Nadu", stateCode: "TN", defaultCity: "Salem / Vellore" },
  "64": { state: "Tamil Nadu", stateCode: "TN", defaultCity: "Coimbatore" },
  "67": { state: "Kerala", stateCode: "KL", defaultCity: "Kozhikode" },
  "68": { state: "Kerala", stateCode: "KL", defaultCity: "Kochi / Ernakulam" },
  "69": { state: "Kerala", stateCode: "KL", defaultCity: "Thiruvananthapuram" },
  "70": { state: "West Bengal", stateCode: "WB", defaultCity: "Kolkata" },
  "71": { state: "West Bengal", stateCode: "WB", defaultCity: "Howrah / Hooghly" },
  "72": { state: "West Bengal", stateCode: "WB", defaultCity: "Midnapore" },
  "73": { state: "West Bengal", stateCode: "WB", defaultCity: "Siliguri / Darjeeling" },
  "74": { state: "West Bengal", stateCode: "WB", defaultCity: "North 24 Parganas" },
  "75": { state: "Odisha", stateCode: "OD", defaultCity: "Bhubaneswar / Cuttack" },
  "76": { state: "Odisha", stateCode: "OD", defaultCity: "Rourkela / Berhampur" },
  "77": { state: "Odisha", stateCode: "OD", defaultCity: "Sambalpur" },
  "78": { state: "Assam", stateCode: "AS", defaultCity: "Guwahati" },
  "79": { state: "North East States", stateCode: "NE", defaultCity: "Shillong / Agartala" },
  "80": { state: "Bihar", stateCode: "BR", defaultCity: "Patna" },
  "81": { state: "Bihar", stateCode: "BR", defaultCity: "Bhagalpur" },
  "82": { state: "Bihar", stateCode: "BR", defaultCity: "Gaya" },
  "83": { state: "Jharkhand", stateCode: "JH", defaultCity: "Ranchi / Jamshedpur" },
  "84": { state: "Bihar", stateCode: "BR", defaultCity: "Muzaffarpur" },
  "85": { state: "Bihar", stateCode: "BR", defaultCity: "Purnia" },
};

/**
 * Validate and look up city/state/ETA from 6-digit PIN code
 */
export function lookupPincode(pincode: string): PincodeInfo {
  const cleanPin = pincode.trim().replace(/\D/g, "");

  if (cleanPin.length !== 6) {
    return {
      valid: false,
      pincode: cleanPin,
      city: "",
      state: "",
      stateCode: "",
      isRajasthan: false,
      etaDays: "",
      codAvailable: false,
    };
  }

  const prefix = cleanPin.slice(0, 2);
  const info = PIN_PREFIX_MAP[prefix];

  if (!info) {
    // Fallback for valid 6 digit pin outside known prefix map
    return {
      valid: true,
      pincode: cleanPin,
      city: "All India Delivery",
      state: "India",
      stateCode: "IN",
      isRajasthan: false,
      etaDays: "4–6 business days",
      codAvailable: true,
    };
  }

  const isRajasthan = info.state === "Rajasthan";
  const isMetro = ["11", "40", "56", "70", "60", "50"].includes(prefix);

  const etaDays = isRajasthan
    ? "2–3 business days"
    : isMetro
    ? "3–4 business days"
    : "4–6 business days";

  return {
    valid: true,
    pincode: cleanPin,
    city: info.defaultCity,
    state: info.state,
    stateCode: info.stateCode,
    isRajasthan,
    etaDays,
    codAvailable: true,
  };
}

/**
 * Compute GST tax split in integer paise based on delivery state
 * Rajasthan delivery = CGST (rate / 2) + SGST (rate / 2)
 * Interstate delivery = IGST (rate)
 */
export interface TaxSplit {
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalTaxPaise: number;
  gstPercent: number;
  isInterstate: boolean;
}

export function calculateGstSplit(
  totalInclusivePaise: number,
  gstPercent: number,
  deliveryState: string
): TaxSplit {
  // Tax inclusive formula: Taxable = Inclusive / (1 + Rate / 100)
  // Tax Amount = Inclusive - Taxable
  const rateFactor = 1 + gstPercent / 100;
  const taxablePaise = Math.round(totalInclusivePaise / rateFactor);
  const totalTaxPaise = totalInclusivePaise - taxablePaise;

  const isRajasthan = deliveryState.trim().toLowerCase() === "rajasthan";

  if (isRajasthan) {
    // Rajasthan workshop to Rajasthan address: CGST + SGST split 50/50
    const halfTax = Math.floor(totalTaxPaise / 2);
    const sgstPaise = totalTaxPaise - halfTax; // handle odd paise roundoff
    return {
      taxablePaise,
      cgstPaise: halfTax,
      sgstPaise,
      igstPaise: 0,
      totalTaxPaise,
      gstPercent,
      isInterstate: false,
    };
  } else {
    // Rajasthan to any other State/UT: Full IGST
    return {
      taxablePaise,
      cgstPaise: 0,
      sgstPaise: 0,
      igstPaise: totalTaxPaise,
      totalTaxPaise,
      gstPercent,
      isInterstate: true,
    };
  }
}
