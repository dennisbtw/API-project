import { editSpotThunk} from "../../store/spots"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots[spotId]);
    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const error = {};
      setSubmitted(true);
      
      if(!name) {
        error.name= "Name is required"
        setErrors(error)
        return error
      }
      if(description.length < 30) {
      error.description = "Description 30 or more characters"
      setErrors(error)
      return error
      }

      const spotData = {
        address,
        city,
        state,
        country,
        lat: 0,
        lng: 0,
        name,
        description,
        price,
      };
  
      const updatedSpot = await dispatch(editSpotThunk(spotData, spotId));
  
      if (updatedSpot.errors) {
        setErrors({ ...updatedSpot.errors, ...errors });
      } else {
        navigate(`/spots/${updatedSpot.id}`);
      }
    };
  
    useEffect(() => {
      const validationErrors = {}
  
      if (submitted && !country) {
        validationErrors.country = "Country is required";
      }
  
      if (submitted && !address) {
        validationErrors.address = "Address is required";
      }
  
      if (submitted && !city) {
        validationErrors.city = "City is required";
      }
  
      if (submitted && (!description || description.length < 30)) {
        validationErrors.description = "Description must be 30 or more characters";
      }
  
      if (submitted && !state) {
        validationErrors.state = "State is required";
      }
  
      if (submitted && !name) {
        validationErrors.name = "Name is required";
      }
  
      if (submitted && !price) {
        validationErrors.price = "Price is required";
      }
  
      setErrors(validationErrors);
    }, [country, address, city, description, state, name, price, submitted]);
  
    return (
        <div id="create-spot-container">
    
          <form onSubmit={handleSubmit} id="create-spot-form">
            <h2 id="h2-create-spot-header">Update your spot</h2>
            <h3 id="h3-create-spot-header">Where&apos;s your place located?</h3>
            <h4 id="h4-create-spot-header">Guests will only get your exact address once they booked a reservation</h4>
            <label id="country-label-spot">
              <div>
                Country {"country" in errors && <span style={{ color: "red" }}>{errors.country}</span>}
              </div>
              <input
                className="country-input"
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
            <label id="address-label-spot">
              <div>
                Street Address {"address" in errors && <span style={{ color: "red" }}>{errors.address}</span>}
              </div>
              <input
                className="address-input"
                type="text"
                placeholder="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <div id="city-state-div">
              <label id="city-label-spot">
                <div>
                  City {"city" in errors && <span style={{ color: "red" }}>{errors.city}</span>}
                </div>
                <input
                  className="city-input"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <span id="comma">,</span>
              <label id="state-label-spot">
                <div>
                  State {"state" in errors && <span style={{ color: "red" }}>{errors.state}</span>}
                </div>
                <input
                  className="state-input"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </label>
    
            </div>
            <label className="create-border-bottom">
              <h2 id="describe-place-header">Describe your place to guests</h2>
              <h4 className="create-form-subheader">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</h4>
              <textarea
                className="create-text-area"
                value={description}
                placeholder="Please write at least 30 characters"
                onChange={(e) => setDescription(e.target.value)}
              />
              {submitted && <span style={{ color: "red" }}>{errors.description}</span>}
            </label>
            <label className="create-border-bottom">
              <h2>Create a title for your spot</h2>
              <h4 className="create-form-subheader">Catch guests&apos; attention with a spot title that highlights what makes your place special</h4>
              <input
                className="spot-name-input"
                type="text"
                value={name}
                placeholder="Name of your spot"
                onChange={(e) => setName(e.target.value)}
              />
              {"name" in errors && <span style={{ color: "red" }}>{errors.name}</span>}
            </label>
            <label className="create-border-bottom">
              <h2>Set a base price for your spot</h2>
              <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
              <div className="price-input-container">
              <span className="money-sign">$ </span>
              <input
                className="price-input"
                type="number"
                value={price}
                min={1}
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              {"price" in errors && <p style={{ color: "red" }}>{errors.price}</p>}
            </label>
            <button id="submit-create-spot" type="submit">Update Spot</button>
      </form>
    </div>
    );
  };
  
  export default UpdateSpot;