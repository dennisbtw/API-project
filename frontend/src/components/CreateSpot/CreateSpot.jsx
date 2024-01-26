import { createSpotThunk } from "../../store/spots"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateSpot.css'

const CreateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
//   const imagesArr = [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};
    setSubmitted(true)

    if(!previewImage) {
      error.previewImage = "Preview Image required"
      setErrors(errors)
      return errors
    }

    if(!name) {
        error.name= "Name is required"
        setErrors(errors)
        return errors
    }
    if(description.length < 30) {
      error.description = "Description 30 or more characters"
      setErrors(errors)
      return errors
    }
    
  //     setErrors(error);

  // // Check if there are any errors and return if there are
  // if (Object.keys(error).length > 0) {
  //   return error;
  // }
    
  //   const imageUrls = [image1, image2, image3, image4];
  //   for (let i = 0; i < imageUrls.length; i++) {
  //     const imageUrl = imageUrls[i];
  //     if (imageUrl) {
  //       const extension = imageUrl.split('.').pop().toLowerCase();
  //       if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
  //         error[`image${i + 1}`] = "Image URL needs to end in png or jpg (or jpeg)";
  //         setErrors(error);
  //         return error;
  //       }
  //     }
  //   }
  //   setErrors(error);

    const spot = {
      address,
      city,
      state,
      country,
      lat: 0,
      lng: 0,
      name,
      description,
      price
    }

    const imagesArr = [previewImage, image1, image2, image3, image4].filter(img => img);

    const newSpot = await dispatch(createSpotThunk(spot, imagesArr));

    if (newSpot && newSpot.id) {

    //   setCountry('')
    //   setAddress('')
    //   setCity('')
    //   setState('')
    //   setDescription('')
    //   setName('')
    //   setPrice('')
    //   setPreviewImage('')
    //   setImage1('')
    //   setImage2('')
    //   setImage3('')
    //   setImage4('')

      navigate(`/spots/${newSpot.id}`)
    } else {
        setErrors({ ...newSpot.errors, ...errors });
    }
  }

  useEffect(() => {
    const validationErrors = {}

    if(submitted && !country) {
      validationErrors.country = "Country is required"
    }

    if(submitted && !address) {
      validationErrors.address = "Address is required"
    }

    if(submitted && !city) {
      validationErrors.city = "City is required"
    }

    if(submitted && description.length < 30) {
      validationErrors.description = "Description 30 or more characters"
    }

    if(submitted && !state) {
      validationErrors.state = "State is required"
    }
    
    if(submitted && !name) {
      validationErrors.name = "Name is required"
    }

    if(submitted && !price) {
      validationErrors.price = "Price is required"
    }

    if (submitted && !previewImage) {
      validationErrors.previewImage = "Preview Image is required"
    }

    setErrors(validationErrors)
  }, [country, address, city, description.length, state, name, price, previewImage, submitted])

  return (
    <div id="create-spot-container">

      <form onSubmit={handleSubmit} id="create-spot-form">
        <h2 id="h2-create-spot-header">Create a new Spot</h2>
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
        <label className="create-border-bottom" id="photo-inputs">
          <h2 id="photo-header-form">Liven up your spot with photos</h2>
          <h4 className="create-form-subheader">Submit a link to at least one photo to publish your spot</h4>
          <input
            className="preview-image-url"
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {(submitted && "previewImage" in errors) && <span style={{ color: "red" }}>{errors.previewImage}</span>}
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
          {/* {errors.image1 && <span style={{ color: "red" }}>{errors.image1}</span>} */}
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          {/* {errors.image2 && <span style={{ color: "red" }}>{errors.image2}</span>} */}
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          {/* {errors.image3 && <span style={{ color: "red" }}>{errors.image3}</span>} */}
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
          {/* {errors.image4 && <span style={{ color: "red" }}>{errors.image4}</span>} */}
        </label>
        <button id="submit-create-spot" type="submit">Create Spot</button>
      </form>
    </div>
  )
}

export default CreateSpot;