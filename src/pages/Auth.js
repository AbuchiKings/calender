import React, { useState, useEffect } from 'react';
import * as queryString from 'query-string';
import { toast } from 'react-toastify';

import Auth from '../utils/authClass';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import request from './../utils/request';

function AuthPage({ history }) {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: 'http://localhost:3000/',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar.readonly'
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

    const [code, setCode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function loginUser(payload) {
        const resp = await request({ route: '/login', verb: 'post', payload });
        const data = resp.data.data
        let user = JSON.stringify(data);
        localStorage.setItem('user', user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data._id);
        const expAt = JSON.stringify((60 * 24 * 60 * 60 * 1000) + new Date().getTime());
        localStorage.setItem('expAt', expAt);
        return data;
    }
    const auth = new Auth(history);

    function login() {
        if (auth.isAuthenticated()) return auth.pushAuthenticated();
        const urlParams = queryString.parse(window.location.search);
        if (urlParams.error) {
            toast.error('An error occured. Please try again.');
        } else if (urlParams.code) {
            setCode(urlParams.code);
            setIsLoading(true)
            loginUser({ code: urlParams.code })
                .then(() => {
                    toast.success('Successfully logged in')
                    setTimeout(() => history.push('/home'), 1000)
                }).catch(err => {
                    let message = err.response && err.response.data ? err.response.data.message : 'An error occured. Please try again.';
                    setIsLoading(false)
                    toast.error(message);
                    return;
                });
        }
    }

    useEffect(() => {
        login();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id="wrapper" style={{ width: '80%', maxWidth: '700px', textAlign: 'center', margin: 'auto', marginTop: '20px' }}>
            <Card className="text-center">
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <Card.Title>Calender</Card.Title>
                    {code && isLoading ? <p className="btn btn-primary">
                        Loading....
                    </p> :
                        <Button variant="primary">
                            <a href={googleLoginUrl} style={{ color: 'white', textDecoration: 'none' }}>
                                Sign in
                            </a>
                        </Button>}
                </Card.Body>
                <Card.Footer className="text-muted">Calender app @2021</Card.Footer>
            </Card>
        </div>

    );
}

export default AuthPage;
