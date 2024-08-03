import Form from "../components/Form/Form";
import '../container/HomePage.css'
function HomePage() {
    return ( <>
    <>
    <div className="form_container">
    <div>Welcome to home page you can fill your details here.
        <p>Basic form</p>
    </div>
    
    <Form/>
    <div>
         <img src="paper_2.jpg"></img>
     </div>
    </div>
    
    </>
    </> );
}

export default HomePage;