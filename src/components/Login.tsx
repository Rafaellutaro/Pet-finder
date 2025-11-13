import { useState } from "react";
import Header from "./Header"
import { Link } from "react-router-dom";
import "../assets/css/Login.css"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = (e: any) => {
        e.preventDefault();

        console.log(email);
        console.log(password);

        // create api call to express here
    }

    return (
        <><Header />
            <section>

                <div className="Login-Container">

                    <form onSubmit={login}>

                        <div className="email">
                            <input type="email"
                                value={email}
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>

                        <div className="password">
                            <input type="password"
                                value={password}
                                placeholder="Senha"
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>

                        <button type="submit">Login</button>

                    </form>

                </div>
                
                <div className="Bellow-Message">

                    <p><Link to={"/changePassword"}>Esqueci a Senha</Link></p>
                    <p><Link to={"/register"}>Criar Conta</Link></p>

                </div>

            </section>
        </>
    )

}

export default LoginPage;