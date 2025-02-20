
  export const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
  
    // Show first 2 letters, mask the rest, and keep "@gmail.com"
    return name.substring(0, 2) + "***@" + domain;
  };
  export const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.substring(0, 2) + "*****" + phone.slice(-3);
  };