import useCanister from "../hooks/useCanister";

const defaultLoginLogoutButtonStyles = `
  w-auto h-auto rounded-lg p-4 transition 
  border-4  border-stone-700
  text-indigo-300 text-4xl uppercase font-extrabold tracking-widest
  bg-slate-900  hover:translate-y-1
  active:bg-slate-700 active:border-4 active:scale-102 active:translate-y-2
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