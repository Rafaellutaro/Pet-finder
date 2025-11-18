import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Login.css"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const login = async (e: any) => {
        e.preventDefault();

        console.log(email);
        console.log(password);

        // create api call to express here

        const loginDetails = {
            email,
            password
        }

        try {
            const sendRes = await fetch('http://localhost:3000/users/getEmail', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(loginDetails)
            })
            const data = await sendRes.json();
            console.log("dados do usuario", data);

            navigate("/Profile")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
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