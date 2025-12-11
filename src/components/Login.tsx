import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Login.css"
import { useUser } from '../Interfaces/GlobalUser';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { setUser } = useUser();
    const { setToken } = useUser();
    const { setLoggedIn } = useUser();

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
            // maybe try to fit those two endPoints in only 1, would be cleaner.

            const sendRes = await fetch('http://localhost:3000/users/getEmail', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(loginDetails)
            })
            const data = await sendRes.json();
            console.log("dados do usuario", data);

            // creating a global variable for the user data

            const createToken = await fetch('http://localhost:3000/users/createToken', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data.data)
            })

            const tokenRes = await createToken.json();

             setUser(data.data);
             setToken(tokenRes.accessToken);
             setLoggedIn(true);

            navigate("/Profile")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <section className="section-container">

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

                        <button className="loginBtn" type="submit">Login</button>

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