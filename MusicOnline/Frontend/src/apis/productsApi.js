import axiosClient from './axiosClient';

const productApi = {
    /*Danh sách api tên bài hát */

    getDetailCategory(id) {
        const url = '/get_title/' + id;
        return axiosClient.get(url);
    },
    getListCategory() {
        const url = '/list_titles';
        return axiosClient.get(url);
    },
    deleteCategory(id) {
        const url = "/delete_title/" + id;
        return axiosClient.delete(url);
    },

    /*Danh sách api nghệ sĩ */

    getDetailArtist(id) {
        const url = '/artist/' + id;
        return axiosClient.get(url);
    },
    getListArtist() {
        const url = '/artist';
        return axiosClient.get(url);
    },
    deleteArtist(id) {
        const url = "/artist/" + id;
        return axiosClient.delete(url);
    },

     /*Danh sách api bài hát */

    getDetailSong(id) {
        const url = '/song/' + id;
        return axiosClient.get(url);
    },
    getListSong() {
        const url = '/song';
        return axiosClient.get(url);
    },
    deleteSong(id) {
        const url = "/delete_song/" + id;
        return axiosClient.delete(url);
    },
}

export default productApi;