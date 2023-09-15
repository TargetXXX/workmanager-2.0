import React, { useEffect } from "react";
import Swal from "sweetalert2";

const LogOut: React.FC = () => {

    useEffect(() => {
        const handleLogOut = async () => {
            Swal.fire({
                title: "Saindo",
                text: "Aguarde...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            sessionStorage.removeItem("token");

            await new Promise(resolve => setTimeout(resolve, 1000));

            Swal.close();

            window.location.href = "/login"; 
        }

        handleLogOut();
    }, []);

    return null;
}

export default LogOut;