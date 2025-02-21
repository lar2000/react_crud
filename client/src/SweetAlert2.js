import Swal from 'sweetalert2';

export const Notification = {
  info: (message, title = 'Information', duration = 3000) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      timer: duration,
      showConfirmButton: false,
      willClose: () => {
        Swal.close();
      }
    });
  },
  success: (message, title = 'Success', duration = 3000) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: duration,
      showConfirmButton: false,
      willClose: () => {
        Swal.close();
      }
    });
  },
  warning: (message, title = 'Warning', duration = 3000) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      timer: duration,
      showConfirmButton: false,
      willClose: () => {
        Swal.close();
      }
    });
  },
  error: (message, title = 'Error', duration = 3000) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      timer: duration,
      showConfirmButton: false,
      willClose: () => {
        Swal.close();
      }
    });
  }
};

export const Alert = {
  errorLogin: (message) => { 
    Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: message,
      icon: 'error',
      width: 400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#3085d6',
    });
  },
  errorData: (message) => { 
    Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: message,
      icon: 'error',
      width: 400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#3085d6',
    });
  },
  successData: (message) => { 
    Swal.fire({
      title: 'ແຈ້ງເຕືອນ',
      text: message,
      icon: 'success',
      width: 350,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#0fac29',
    });
  },
  warningData: (message) => { 
    Swal.fire({
      title: 'ຂໍອະໄພ',
      text: message,
      icon: 'info',
      width: 400,
      confirmButtonColor: '#0fac29',
    });
  },
    confirm: async (message) => { 
      const result = await Swal.fire({
        title: 'ແຈ້ງເຕືອນ',
        text: message,
        icon: 'question',
        width: 400,
        confirmButtonColor: '#0fac29',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "ຍົກເລີກ",
      });
  
      return result.isConfirmed; // Return true if confirmed, false otherwise
    },
};