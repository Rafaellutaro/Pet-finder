import { useParams } from "react-router-dom";

function Pet () {
    const {id} = useParams();

    console.log("id here", id)

    return (
        <div>salada</div>
    )
}

export default Pet;