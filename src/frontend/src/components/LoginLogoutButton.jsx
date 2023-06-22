import useCanister from "../hooks/useCanister";

const defaultLoginLogoutButtonStyles = `
  w-auto h-auto rounded-lg px-2 py-2 transition z-10
  text-3xl uppercase tracking-widest
  hover:-translate-y-1 hover:bg-stone-900 hover:text-white
  active:translate-y-1 active:scale-98
`;

const LoginLogoutButton = ({ buttonUtilityStyles = defaultLoginLogoutButtonStyles, changeCallback }) => {
  const { isAuthenticated, login, logout } = useCanister();

  const click = () => {
    isAuthenticated ? logout() : login();
    changeCallback ? changeCallback(!isAuthenticated) : null;
  }

  return (
    <button 
      className={buttonUtilityStyles}
      onClick={click}
        >
        { isAuthenticated ? "logout" : "login"}
    </button>  
  )
};

export default LoginLogoutButton;