import React from 'react'
import AuthLayout from '../components/layouts/AuthLayouts'
import LoginFragment from '../components/fragments/LoginFragment'

const LoginPage = () => {
  return (
   <AuthLayout title={'login'}>
      <LoginFragment>
        
      </LoginFragment>
   </AuthLayout>
  )
}

export default LoginPage