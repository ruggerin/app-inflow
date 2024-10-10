import axios from 'axios';



export const http = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};





function request(method: string) {

    return (url: any, body?: any) => {

        var data = new FormData();

        var config = {
            method: 'get',
            url: 'http://192.168.0.13:8000/api/produtos',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjAuMTAwOjgwMDBcL2FwaVwvYXV0aFwvbG9naW4iLCJpYXQiOjE2ODI0MzEzMjYsImV4cCI6MTY4MjQzNDkyNiwibmJmIjoxNjgyNDMxMzI2LCJqdGkiOiJxaFc4RU1pZndURGZXTkVoIiwic3ViIjoxLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.eJG0YPMz4AWE6cKxW36LbBmlkZtkyBos4hw3qw58Rv0',

            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

    }

}