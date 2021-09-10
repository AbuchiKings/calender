import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';

import request from './../utils/request';


const Dashboard = ({ history }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);

    async function getEvents(payload = {}) {
        const resp = await request({ route: '/events', verb: 'get', payload });
        const data = resp.data.data;
        return data;
    }

    function calenderEvents() {
        setIsLoading(true)
        getEvents()
            .then((data) => {
                setItems(data);
                setIsLoading(false);
                toast.success('Successfully retrieved calender events.');
            }).catch(err => {
                let message = err.response?.data ? err.response.data.message : 'An error occured. Please try again.';
                setIsLoading(false)
                toast.error(message);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    setTimeout(() => history.push('/'), 500);
                }
                return;
            });

    }

    useEffect(() => {
        calenderEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoading ?
        <p className="btn btn-primary" style={{ display: 'block', width: '300px', margin: '50px auto' }}>
            Loading....
        </p>
        :
        (
            <div id="wrapper" style={{
                width: '70%', maxWidth: '1000px', margin: '30px auto', position: 'relative',
                minWidth: '500px',
            }}>
                <div className="header" style={{ marginBottom: '20px' }}>
                    <h4>Calender Events</h4>
                    <p>NB: <i> Events shown include activities for the last 60 days and next 30 days truncated at 50 events max.</i></p> </div>
                <div className='table-responsive' style={{ minWidth: '500px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Summary</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Organizer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.slice(-50).map((item, idx) => {
                                return (<tr key={idx + 1}>
                                    <th scope="row">{idx + 1}</th>
                                    <td>{new Date(item.created).toLocaleDateString()}</td>
                                    <td style={{ width: '35%', minWidth:'200px' }} >{item.summary}</td>
                                    <td>{new Date(item.start.dateTime).toLocaleDateString()}</td>
                                    <td>{new Date(item.end.dateTime).toLocaleDateString()}</td>
                                    <td>{item.organizer.email}</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
}

export default Dashboard;
