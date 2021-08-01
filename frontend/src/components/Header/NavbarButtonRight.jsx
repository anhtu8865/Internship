function NavbarButtonRight({svg}) {
  return (
    <>
      <button
        className="p-1 text-green-400 transition-colors duration-200 rounded-full bg-green-50 hover:text-green-600 hover:bg-green-100 
        focus:outline-none focus:bg-green-100 focus:ring-green-800"
      >
        {svg}
      </button>
    </>
  )
}

export default NavbarButtonRight