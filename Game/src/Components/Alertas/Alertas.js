import Swal from "sweetalert2";

export const TIPO_ALERTA = {
    CONFIRMACAO: 0,
    ERROR:1,
    SUCESSO:2
}

export const CriarAlerta = (tipoAlerta = TIPO_ALERTA.SUCESSO,titulo,mesage,callbackConfirmacion ) => {

    if(tipoAlerta ==TIPO_ALERTA.SUCESSO ){
        Swal.fire({
            position: "center",
            icon: "success",
            title:titulo!= null ? titulo: mesage,
            showConfirmButton: false,
            timer: 1500
          });
          return;
    }


    if(tipoAlerta ==TIPO_ALERTA.ERROR){
        Swal.fire({
            position: "center",
            icon: "error",
            title:titulo!= null ? titulo: mesage,
            showConfirmButton: false,
            timer: 1500
          });
          return;
    }


    Swal.fire({
        title: titulo,
        text: mesage,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Fechar"
      }).then((result) => {
        if (result.isConfirmed) {
            callbackConfirmacion()
        }
      });

};
