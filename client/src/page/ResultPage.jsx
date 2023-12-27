import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { FormField, Loader } from '../components';
import { useData } from './DataContext'; // Assuming this is the correct path to your custom hook
const CreatePost = () => {


  const navigate = useNavigate();
  const { data, updateData } = useData(); // Use the custom hook to get and update data from the DataContext
  
  const [form, setForm] = useState({
    prompt: `${data.businessName}, ${data.description}, targeting ${data.targetAudience} with a color theme of ${data.color}`,
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = () => {
    // Pass the generated image data to the ImageEditor route
    navigate('/image-editor', { state: {photo: form.photo}});
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
  
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };
  

  useEffect(() => {
    generateImage();
  }, [data]);
 
 
  
  return (
    <section className="max-w-7xl mx-auto">
     
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
         

        

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="prompt-display">
        <p>Your request: {data.businessName}, {data.description}, targeting {data.targetAudience} with a color theme of {data.color}.</p>
      </div>
      <div className="actions">
        <button type="button" onClick={() => {/* Handle save functionality */}}>Save</button>
        <button type ="button"onClick={handleEdit}>Edit</button>
    </div>
      </form>
    </section>
  );
};

export default CreatePost;
