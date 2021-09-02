import FormInput from '../components/Form/FormInputNew'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import userApi from '../api/userApi'
import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { useAppDispatch } from '../store'
import { useToasts } from 'react-toast-notifications'
import { getMe, inforUserSelector } from '../slices/infouser'
import { useSelector } from 'react-redux'

function Login(props) {
  const { register, handleSubmit } = useForm()
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  //check xem đã đăng xuất, đăng nhập hay chưa này 
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
     setIsLogged(!!localStorage.getItem('accessToken')) 
    
  })
  useEffect(() => {
    if (isLogged){
      props.history.push('/app')
      dispatch(getMe())
    }
  }, [isLogged])

  //click login
  const onSubmit = (data) => {
    userApi
      .login(data)
      .then(async (response) => {
        if (response.Msg == 'Login Success') {
          localStorage.setItem('accessToken', response.Data.access_token)
          localStorage.setItem('refreshToken', response.Data.refresh_token)
          props.history.push('/app')
          dispatch(getMe())
          // window.location.reload()
        } else {
          addToast(response.Msg, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      })
      .catch((err) => alert(err))
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  r={register}
                  name="username"
                  label="Username"
                  required
                  placeholder="@gmail or UserName"
                />

                <FormInput
                  r={register}
                  name="password"
                  label="Password"
                  type="password"
                  required
                  placeholder="************"
                />

                <div className="w-full mt-10 mb-5 px-10">
                  <input
                    type="submit"
                    value="Login"
                    className="bg-purple-600 rounded-md py-2 cursor-pointer
            text-white text-xl w-full"
                  />
                </div>
              </form>
              <hr className="my-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
