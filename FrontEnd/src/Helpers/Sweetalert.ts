import Swal, { type SweetAlertIcon } from "sweetalert2";
import withReactContentImport from "sweetalert2-react-content";

const withReactContent: any = withReactContentImport; // ✅ force callable

const MySwal = withReactContent(Swal);

const handleAlert: (action: string, message: string, icon: SweetAlertIcon) => void = (action, message, icon) => {
  MySwal.fire({
    title: action,
    icon,
    text: message,
    confirmButtonText: "OK",
    customClass: { popup: "mui-font" },
  });
};

export const handleSuccess = (action: string, message: string) => {
  handleAlert(action, message, "success");
};

export const handleError = (action: string, message: string) => {
  handleAlert(action, message, "error");
};

export const handleConfirmation :(title :string , text:string)=>Promise<boolean> = async (title:string, text:string)=>{
  try {
        const confirm = await Swal.fire({
          title,
          text,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#6b7280",
          confirmButtonText: "Yes, delete it",
          cancelButtonText: "Cancel",
        });
    
        return confirm.isConfirmed
  } catch (error) {
    throw error ;
  }
} 