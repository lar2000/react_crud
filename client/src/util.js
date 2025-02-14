export const displayDuration = (duration) => {
    const durationLabels = {
      7: "ວັນ (1 week)",
      14: "ວັນ (2 weeks)",
      30: "ວັນ (1 month)",
      60: "ວັນ (2 months)",
      90: "ວັນ (3 months)",
      180: "ວັນ (6 months)",
      365: "ວັນ (1 year)"
    };
  
    return duration < 7
      ? `${duration} ວັນ`
      : `${duration} ${durationLabels[duration] || '/ວັນ'}`;
  };

  export const formatDuration = (time) => {
    if (time < 60) {
      return `${time} Min`;
    } else {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return `${hours} H${minutes > 0 ? ` : ${minutes} Min` : ''}`;
    }
  };