import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name, extraStyle }) => {
  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
      >
        Welcome Back, {name}!
      </Link>
    );
  }
  return <button className="btn btn-secondary">Login</button>;
};

export default ButtonLogin;
