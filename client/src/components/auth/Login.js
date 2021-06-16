import React, {Fragment, useState} from 'react'
import {Link} from 'react-router-dom'

const Login = () => {
    const [formData,setFormdata] = useState({
    
        email:'',
        password:'',

    });

    const {email, password} = formData;

    const onChange = e => 
        setFormdata({ ...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        
            console.log('sucess');
        
    }

    return (
        <Fragment>
        <h1 className="large text-primary">
        Sign In
      </h1>
      <p className="lead"><i className="fas fa-user"></i> Sign in Your Account</p>
      <form onSubmit={e => onSubmit(e)} className="form">
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} minlength="6" />
        </div>
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
        </Fragment>
        
    )
}

export default Login
