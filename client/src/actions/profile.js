import axios from "axios";
import { ACCOUNT_DELETED, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from "./types";
import { setAlert } from "./alert";

import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE
} from './types'

// get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type : GET_PROFILE,
            payload : res.data
        });
    } catch (err) {
        console.log(err.response)
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// get All profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type : CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type : GET_PROFILES,
            payload : res.data
        });
    } catch (err) {
        console.log(err.response)
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// get profile by id
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type : GET_PROFILE,
            payload : res.data
        });
    } catch (err) {
        console.log(err.response)
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// get github repos
export const getGithubRepos = username => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type : GET_REPOS,
            payload : res.data
        });
    } catch (err) {
        console.log(err.response)
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// create or update profile
export const createProfile = (formData, history , edit = false) => async dispatch => {
    try {
        
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const res = await axios.post('/api/profile',formData,config);

        dispatch({
            type : GET_PROFILE,
            payload : res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if(!edit){
            history.push('/dashboard');
        }

    } catch (err) {

        const errors = err.response.data.errors;
        
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// ADD Experience
export const addExperience = (formData , history) => async dispatch => {
    try {
        
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience',formData,config);

        dispatch({
            type : UPDATE_PROFILE,
            payload : res.data
        });

        dispatch(setAlert('Experience Added ', 'success'));

        history.push('/dashboard');
    } catch (err) {

        const errors = err.response.data.errors;
        
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}


// ADD Education
export const addEducation = (formData , history) => async dispatch => {
    try {
        
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education',formData,config);

        dispatch({
            type : UPDATE_PROFILE,
            payload : res.data
        });

        dispatch(setAlert('Education Added ', 'success'));
        
        history.push('/dashboard');
    } catch (err) {

        const errors = err.response.data.errors;
        
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }
}

// delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`api/profile/experience/${id}`);

        dispatch({
            type : UPDATE_PROFILE,
            payload : res.data
        });

        dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
        
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });

    }
}

// delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`api/profile/education/${id}`);

        dispatch({
            type : UPDATE_PROFILE,
            payload : res.data
        });

        dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
        
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });

    }
}

// delete account and profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure. This cannot be undone!')){
    try{
        const res = await axios.delete(`api/profile`);

        dispatch({
            type : CLEAR_PROFILE,
        });

        dispatch({
            type : ACCOUNT_DELETED,
        });

        dispatch(setAlert('YOUR ACCOUNT IS DELETED'));
    } catch (err) {
        
        dispatch({
            type : PROFILE_ERROR,
            payload : {msg : err.response.statusText, status : err.response.status}
        });
    }

    }
}