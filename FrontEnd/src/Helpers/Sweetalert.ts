import Swal ,{type SweetAlertIcon} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal)


const handleAlert : (action :string ,message :string , icon :SweetAlertIcon )=>void =(action,message , icon)=>{
    MySwal.fire({
        title : action ,
        icon ,
        text : message,
        confirmButtonText :"OK",
        customClass :{
            "popup" :"mui-font"
        }
    })
}

export const  handleSuccess  = (action : string ,message:string )=>{
    handleAlert (action , message , "success")
}



export const  handleError  = (action : string ,message:string )=>{
    handleAlert (action , message , "error")
}



