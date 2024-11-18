import { Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";

export default function NavBar({currentTheme,changeTheme}){
   
    return (

        <div className="navbar bg-primary text-primary-content">
            <div className="container mx-auto ">
                <div className="flex-1">
                    <span className="text-2xl text-white font-bold">
                        Expense Manager
                    </span>
                </div>
                <button className="btn btn-square btn-ghost" onClick={changeTheme}>
                    {currentTheme==="light" ? <Moon className="text-white h-5 w-5"></Moon>  : <Sun className="text-white h-5 w-5"></Sun>}
                </button>
            </div>
        </div>

    )

}

NavBar.propTypes={
    currentTheme: PropTypes.oneOf(['light','dark']).isRequired,
    changeTheme: PropTypes.func.isRequired
}

