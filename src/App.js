import React, {  useState  } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import ReactTagInput from "@pathofdev/react-tag-input";
import { useForm } from "react-hook-form";
import axios from 'axios';

import options from './locations_data';
import category_list from './category_data';
import functional_area_list from './functional_area_data';

import './Jobpost.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "@pathofdev/react-tag-input/build/index.css";

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const location_ref = React.createRef();
const category_ref = React.createRef();
const functional_ref = React.createRef();

const LocationSelection = ({onLocationChange}) => {

  return (
    <Typeahead
      multiple  
      id="locations"
      onChange={onLocationChange}
      options={options}
      ref={location_ref}
      placeholder="Please add locations here..."
    />
  );

};

const CategorySelection = ({onCategoryChange}) => {
  const [selected, setSelected] = [];

  return (
    <Typeahead
      id="category_list"
      onChange={onCategoryChange}
      options={category_list}
      placeholder="Please Choose Category"
      selected={selected}
      ref={category_ref}
    />
  );
};

const FunctionalAreaSelection = ({onFunctionChange}) => {
  const [selected, setSelected] = [];

  return (
    <Typeahead
      id="functional_area_list"
      onChange={onFunctionChange}
      options={category_list}
      placeholder="Please Choose Functional Area"
      selected={selected}
      ref={functional_ref}
    />
  );
};


function JobForm()
{
    const [year_data] = useState([]);
    const [full_year_data] = useState([]);
    const [locations_list, updateLocations] = useState([]);
    const [category_name, updateCateogory] = useState([]);
    const [functional_area, updateFunctionalArea] = useState([]);
    const [tags, setTags] = useState([]);

    function setLocationSelection(input, e){
        updateLocations(input); 
    }
    function setCategorySelection(input, e){
        updateCateogory(input); 
    }
    function setFunctionalSelection(input, e){
        updateFunctionalArea(input); 
    }

    const {register, handleSubmit, errors} = useForm();
    const onSubmit = function(data, e){
    
        if (Object.keys(locations_list).length == 0) {    
            toast.error('Please choose atleast one Location', 
               {position: toast.POSITION.BOTTOM_RIGHT})
        } else if(Object.keys(category_name).length == 0) {
            toast.error('Please choose Category', 
               {position: toast.POSITION.BOTTOM_RIGHT})
        } else if(Object.keys(functional_area).length == 0) {
            toast.error('Please choose Functional Area', 
               {position: toast.POSITION.BOTTOM_RIGHT})
        } else if(Object.keys(tags).length == 0) {
            toast.error('Please add atleast one Tag', 
               {position: toast.POSITION.BOTTOM_RIGHT})
        } else {
            toast.success('Job Posted Successfully', 
               {position: toast.POSITION.BOTTOM_RIGHT})
            
            data['locations']       = locations_list;
            data['categories']      = category_name;
            data['functional_area'] = functional_area;
            data['tags']            = tags;

            console.log(data);

            axios({
                  method: 'post',
                  url: 'http://localhost:3000/jobpost',
                  data: data,
                  headers: {'Content-Type': 'multipart/form-data' }
              })
              .then(function (response) {
                  //handle success
                  console.log(response);
              })
              .catch(function (response) {
                  //handle error
                  console.log(response);
              });

              e.target.reset(); 
              location_ref.current.clear();
              category_ref.current.clear();
              functional_ref.current.clear();
              setTags([]);
        }

    }

    setYearData: {

        for (var i = 1; i <=15; i++) {
            year_data.push(i);
        }

        var current_year   = new Date().getFullYear();

        for (var i = 2000; i <=current_year; i++) {
            full_year_data.push(i);
        }
    }

        return(
            <div className='form-body'>
                <div className='form-heading'> Post Job </div>

                <form name="jobpostform" onSubmit={handleSubmit(onSubmit)}>

                    <div className='sub-heading'> 
                        Basic Details
                    </div>

                    <div className="form-group">
                        <label for="job_title">
                            Job Title <span className='required'>*</span> 
                        </label>
                        <input name="job_title" type="text" ref={register({required: true})} className="form-control" id="job_title" refs="job_title" placeholder="Write a title that appropriatly describes the job.">
                        </input>

                        {errors.job_title && <p> This is Required </p>}

                    </div>

                    <div className="form-group">
                        <label>
                            Locations <span className='required'>*</span> 
                        </label>
                        <LocationSelection onLocationChange={setLocationSelection}></LocationSelection>
                        
                        {errors.locations && <p> Choose Atleast one location </p>}

                    </div>

                    <div className="form-group">
                        <label>
                            Years of Experience <span className='required'>*</span> 
                        </label>
                          <div className="row">
                            <div className="col">
                                <select name="from_experience" className="form-control" ref={register({required: true})}>
                                    <option value="">Select Min</option>
                                    {year_data.map(d => (<option value={d}>{d}</option>))}
                                </select>

                                {errors.from_experience && <p> This is Required </p>}
                            </div>
                            <div className="col">
                                <select name="to_experience" className="form-control" ref={register({required: true})}>
                                    <option value="">Select Max</option>
                                    {year_data.map(d => (<option value={d}>{d}</option>))}
                                </select>

                                {errors.to_experience && <p> This is Required </p>}
                            </div>
                            
                          </div>

                    </div>     

                    <div className="form-group">
                        <label for="job_description">
                            Job Description <span className='required'>*</span> 
                        </label>
                        <textarea name="job_description" ref={register({required: true})} className="form-control" id="job_description" refs="job_description" placeholder="Describe Roles & Responsibilies required for the job">
                        </textarea>

                        {errors.job_description && <p> This is Required </p>}
                    </div>             

                    <div className='sub-heading'> 
                        Targeting
                    </div>

                    <div className="form-group">
                      <div className="row">
                        <div className="col">
                            <label>
                                Category <span className='required'>*</span> 
                            </label>
                            <CategorySelection onCategoryChange={setCategorySelection}></CategorySelection>
                        </div>
                        <div className="col">

                            <label>
                                Functional Area <span className='required'>*</span> 
                            </label>
                            <FunctionalAreaSelection onFunctionChange={setFunctionalSelection}></FunctionalAreaSelection>
                        </div>
                      </div>
                    </div>     

                    <div className="form-group">
                        <label>
                            Graduating Year <span className='required'>*</span> 
                        </label>
                          <div className="row">
                            <div className="col">
                                <select name="min_batch" className="form-control" ref={register({required: true})}>
                                    <option value="">Min Batch</option>
                                    {full_year_data.map(d => (<option value={d}>{d}</option>))}
                                </select>
                                {errors.min_batch && <p> This is Required </p>}
                            </div>
                            <div className="col">
                                <select name="max_batch" className="form-control" ref={register({required: true})}>
                                    <option value="">Max Batch</option>
                                    {full_year_data.map(d => (<option value={d}>{d}</option>))}
                                </select>
                                {errors.max_batch && <p> This is Required </p>}
                            </div>
                          </div>

                    </div>     

                    <div className="form-group">
                        <label>
                            Tags <span className='required'>*</span> 
                        </label>
                            <ReactTagInput 
                              tags={tags} 
                              placeholder="Type and press enter"
                              maxTags={10}
                              editable={false}
                              readOnly={false}
                              removeOnBackspace={true}
                              onChange={(newTags) => setTags(newTags)}
                            />

                    </div>



                    <button type="submit" className="btn btn-primary">Submit</button>

                </form>
            </div>  
        )
}

export default JobForm;
