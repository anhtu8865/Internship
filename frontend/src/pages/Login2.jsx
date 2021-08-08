// import FormInput from "../components/Form/FormInput";
// import React, { Component } from 'react';
// import userApi from "../api/userApi"

// class Login extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       username: "",
//       password: ""
//     }
//   }

//   onChangeUser = (event) => {
//     this.setState({ username: event.target.value }, () => console.log(this.state.username))
//   }

//   onChangePass = (event) => {
//     this.setState({ password: event.target.value }, () => console.log(this.state.password))
//   }

//   login = () => {
//     userApi.logIn({ "username": this.state.username, "password": this.state.password }).then(response => {
//       localStorage.setItem("accessToken", response.token)
//       // window.location.reload();
//     }).catch(err => console.log(err))
//     // console.log(response.text())
//     // if (response.ok){
//     //   console.log('OK OK')
//     //   alert("thanh cong")
//     // }
//     // else{
//     //   alert("That bai")
//     // }
//     // console.log(this.state.username)
//     // console.log(this.state.password)
//   }

//   render() {
//     return (
//       <div className="w-full h-auto">
//         <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-3/4 bg-white mx-auto mt-16">
//           <h1 className="text-2xl font-bold pb-8">Login đi nè</h1>
//           <hr className="mb-5" />
//           <div className="px-6">
//             <form noValidate>
//               <FormInput type={'text'} text={'Username'} onChangeVal={this.onChangeUser} />
//               <FormInput type={'password'} text={'Password'} onChangeVal={this.onChangePass} />
//               <div className="w-full mt-10 mb-5 px-10">
//                 <button className="bg-green-600 rounded-md py-2 
//               text-white text-xl w-full" onClick={this.login}>
//                   Login
//               </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default Login