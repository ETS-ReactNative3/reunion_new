import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from 'react-redux-firebase'

import propTypes from 'prop-types'

import Spinner from "../layout/Spinner";

import { bindActionCreators } from 'redux';

import { search } from "../../actions/settingActions";

class ClientsVerifyList extends Component {
    state = {
        verify: "belum terverifikasi",
        ids: []
    }


    // onSubmitVerify = () => {
    //     // e.preventDefault();

    //     // mailgun.client({})

    //     let { clients, firestore, history } = this.props;
    //     const ids = this.state.ids;

    //     // const {verify} = this.state;
    //     clients = clients.filter(client => ids.indexOf(client.id) > -1);

    //     clients.map(client => {
    //         client.verify = true;
    //         firestore.update({ collection: 'clients', doc: client.id }, client);
    //     });
    // }

    // onChange = (index, e) => {

    //     // console.log(index)

    //     this.setState({ [e.target.name]: e.target.value })
    //     // const { clients } = this.props;
    //     // const verify = e.target.value
    //     // console.log(clients)
    //     // const newVar = clients.map((clientVer) => {
    //     //     return {...clientVer, verify: e.target.value}
    //     // })

    //     // this.setState(clients[index], verify)
    //     // console.log(newVar)

    // };

    handleChange(index, dataType, value) {
        const { clients } = this.props
        const newState = clients.map((item, i) => {
            if (i === index) {
                return { ...item, [dataType]: value };
            }
            return item;
        });

        this.setState({
            clients: newState
        })
    }

    render() {
        const { firebase } = this.props;
        const { clients, search, value } = this.props;

        var Clients = [];

        if (clients) {
            const filteredClients = clients.filter((client) => {
                return client.verify === true;
            }).map((client) => {
                var Client = {
                    firstName: "",
                    email: "",
                    saldo: 0.00,
                    clientId: "",
                    images: {
                        url: "",
                        key: ""
                    }
                };

                const task = firebase.storage().ref(client.downloadFileUrl);

                task.getDownloadURL().then((url) => {
                    document.querySelector('img#img' + client.id).src = url;
                }).catch((error) => {
                    console.log(error)
                })

                Client.clientId = client.id;
                Client.firstName = client.firstName;
                Client.email = client.email;
                Client.totalAmount = client.totalAmount;
                Client.images = {
                    key: "img" + client.id,
                    url: ""
                };
                return Client;
            });


            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-8">
                            <h3>
                                {' '}
                                <i className="fas fa-users"></i> Daftar Alumni Terverifikasi{' '}
                            </h3>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <h5 className="text-secondary">
                                Total Dana{' '}
                                <span className="text-primary">
                                    {/* Rp. {parseFloat().toFixed(2)}
                                    Rp. {(totalOwed).toLocaleString('id')} */}
                                </span>
                            </h5>
                        </div>

                    </div>
                    <br></br>
                    <div className="table-responsive">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-8">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Cari Alumni" onChange={(e) => search(e.target.value)} value={value} />
                                </div>
                            </div>

                        </div>
                        {/* <div className="container">
                            <div className="row float-right">
                                <div className="col-sm">
                                    <input type="submit" onClick={() => this.onSubmitVerify()} value="Submit Verifikasi" className="btn btn-primary btn-block" />
                                </div>
                            </div>
                        </div> */}

                        <br />
                        <br />
                        <table className="table table-striped">
                            <thead className="thead-inverse">
                                <tr>
                                    <th>No</th>
                                    <th>Foto</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Saldo</th>
                                    {/* <th>Verifikasi</th> */}
                                    <th>Detil</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client, index) =>
                                    (
                                        <tr key={client.clientId} >
                                            <td>{index + 1}</td>
                                            <td><img id={client.clientId} /></td>
                                            <td>{client.firstName}</td>
                                            <td>{client.email}</td>
                                            <td>Rp. {client.totalAmount}</td>
                                            {/* <td>Rp. {client.balance.toLocaleString('id')}</td> */}
                                            {/* <td> */}
                                                {/* <select className="form-control" name="verify" onChange={(e) => this.handleChange(index, 'ver', e.target.value)} >
                                                <option value="belum terverifikasi">Belum Terverifikasi</option>
                                                <option value="terverifikasi">Terverifikasi</option>
                                            </select> */}
                                                {/* < div className="form-check" >
                                                    <input type="checkbox" onClick={() => this.onCheckChange(client.clientId, index)} className="form-check-input" id={"verifyMember" + index} />
                                                    <label className="form-check-label" htmlFor={"verifyMember" + index}>Verify</label>
                                                </div> */}
                                            {/* </td> */}
                                            <td>
                                                <Link to={`/client/${client.clientId}`} className="btn btn-primary btn-sm">
                                                    <i className="fas fa-arrow-circle-right"></i> Details
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div >

                </div >

            );
        } else {
            return (
                <Spinner />
            );
        }
    }
}

ClientsVerifyList.propTypes = {
    firestore: propTypes.object.isRequired,
    clients: propTypes.array
}

function mapStateToProps({ clients }) {
    return { value: clients }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ search }, dispatch);
}


export default compose(
    firestoreConnect([{
        collection: 'clients'
    }]),
    connect((state, props) => ({
        clients: state.firestore.ordered.clients
    })),
    connect(mapStateToProps, mapDispatchToProps)
)(ClientsVerifyList);
