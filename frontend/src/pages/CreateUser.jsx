import FormInput from '../components/Form/FormInputNew'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import userApi from '../api/userApi'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Label, Input, HelperText } from '@windmill/react-ui'
import { ErrorSharp } from '@material-ui/icons'
import { EyeIcon } from '../icons'
const isValidEmail = (email) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  //validate email
  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email)
    return isValid
  }
  const { addToast } = useToasts()
  const history = useHistory()
  const onSubmit = (data) => {
    userApi
      .create(data)
      .then(() => {
        alert('Create User Success')
        history.goBack()
      })
      .catch((err) =>
        addToast(err.response.data.Msg, {
          appearance: 'error',
          autoDismiss: true,
        })
      )
  }
  //show password
  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }
  return (
    <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create New User</h1>
        <hr className="mb-5" />
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label className="mb-5 w-full relative z-0">
              <label>Full Name</label>
              <Input
                {...register('fullname', {
                  required: true,
                  minLength: 6,
                })}
                name="fullname"
                label="Full name"
                required="required: true, minLength: 6"
                placeholder="Jane Done"
              />
              {errors.fullname && (
                <HelperText style={{ color: 'red' }}>
                  Full Name should have more than 6 characters
                </HelperText>
              )}
            </Label>

            <Label className="mb-5 w-full relative z-0">
              <label>User Name</label>
              <Input
                {...register('username', { required: true, minLength: 6 })}
                name="username"
                label="Username"
                required
                placeholder="Jane Done"
              />
              {errors.username && (
                <HelperText style={{ color: 'red' }}>
                  User Name should have more than 6 characters
                </HelperText>
              )}
            </Label>

            <Label className="mb-5 w-full relative z-0">
              <label>Email</label>
              <Input
                {...register('email', {
                  required: true,
                  validate: handleEmailValidation,
                })}
                name="email"
                label="Email"
                required
                placeholder="@gmail"
              />
              {errors.email && (
                <HelperText style={{ color: 'red' }}>Email wrong</HelperText>
              )}
            </Label>

            <Label className="mb-5 w-full relative z-0 pass-wrapper">
              <label>Password</label>
              <div
                className="rounded-md border focus:ring-purple-700 focus:border-transparent"
                style={{ position: 'relative', display: 'flex' }}
              >
                <Input
                  className="focus:none"
                  style={{ border: 'none' }}
                  {...register('password', { required: true, minLength: 6 })}
                  name="password"
                  label="Password"
                  placeholder="*******"
                  type={passwordShown ? 'text' : 'password'}
                ></Input>
                <EyeIcon
                  className="w-6 h-10 mr-2 ml-2"
                  aria-hidden="true"
                  onClick={togglePasswordVisiblity}
                ></EyeIcon>
              </div>
              {errors.password && (
                <HelperText style={{ color: 'red' }}>
                  Password should have more than 6 characters
                </HelperText>
              )}
            </Label>
            <div className="grid grid-cols-1 my-4">
              <Label className="">Global Role</Label>
              <select
                className="py-2 px-3 rounded-md border border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-transparent"
                {...register('globalrole')}
              >
                <option value="2">Member</option>
                <option value="1">Trusted</option>
                <option value="0">Admin</option>
              </select>
            </div>
            <div className="w-full mt-10 mb-5 px-10">
              <input
                type="submit"
                value="Create User"
                className="bg-purple-600 rounded-md py-2 cursor-pointer
            text-white text-xl w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
