class Auth {
    constructor(history) {
        this.history = history;
    }

    isAuthenticated = () => {
        return localStorage.getItem('token') && localStorage.getItem('user') ?
            new Date().getTime() < JSON.parse(Number(localStorage.getItem('expAt'))) : false;
    }

    pushAuthenticated = () => {
        return this.history.push('/home')
    }
}

export default Auth;