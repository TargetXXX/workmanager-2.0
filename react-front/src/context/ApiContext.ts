import Swal from "sweetalert2";
import api from "../api";
import { User } from "../utils/GetUser";

export const update = async (id: number, user: User) => {

    Swal.showLoading();

    const response = await api.put(`/edit/user/${id}`, user);
    let data = response.data;
    Swal.close();
    if(data.success) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Usuário salvo com sucesso.',
        }); 
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao salvar usuário.',
        });
    }
}