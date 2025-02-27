
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

  export const getAuthenFK = () => {
    try {
      const authen = localStorage.getItem('authen_fk');
      return authen ? authen.split(',').map(Number) : [];
    } catch {
      return [];
    }
  };
  
  export const AuthenActions = (authen_fk = getAuthenFK()) => {
    const permissions = Array.isArray(authen_fk) ? authen_fk : [authen_fk];
  
    return {
      canRead: permissions.includes(10001),
      canCreate: permissions.includes(10002),
      canUpdate: permissions.includes(10003),
      canDelete: permissions.includes(10004)
    };
  };
  
  