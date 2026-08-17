import React, { useState } from "react";
import btnlogo from "../../assets/img/kyc/btnlogo.png";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Popup = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [employment, setEmployment] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [income, setIncome] = useState("");
  const [wealth, setWealth] = useState("");
  const navigate = useNavigate()

  const handleSubmit = () => {
    // Validate all fields are selected
    if (!employment || !industry || !experience || !income || !wealth) {
      toast.warning("Please fill all fields before submitting.");
      return;
    }

    // Pass data back to parent KYC component
    onSubmit({
      studentdetails: employment,
      department: industry,
      experience,
      income,
      wealth,
    });
    toast.success("All Feilds are submitted")
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss draggable transition={Slide}
      />
      <div className="bg-white w-[400px] md:w-[530px] p-6 rounded-3xl flex flex-col gap-4">
        {/* Close button */}
        <h3 className="cursor-pointer text-2xl flex justify-end" onClick={()=> {onClose(); navigate("/profile") }}>X</h3>

        {/* STEP 1 — Employment */}
        {step === 1 && (
          <>
            <p className="font-semibold text-2xl text-center mt-6">What is your Employment Status?</p>
            <div className="flex justify-center mt-3">
              <div className="border border-gray-400 w-96 rounded-md flex flex-col divide-y divide-gray-400">
                {["Employed (Full-Time)", "Self-employed", "Employed (Part Time)", "Unemployed", "Marketing / PR", "Student", "Retired"].map(item => (
                  <h2
                    key={item}
                    className={`p-3 cursor-pointer font-semibold text-center hover:bg-blue-100 ${employment === item ? "bg-blue-200" : ""}`}
                    onClick={() => setEmployment(item)}
                  >
                    {item}
                  </h2>
                ))}
              </div>
            </div>
            {/* <button className="mt-4 px-4 py-2 mx-12 bg-blue-500 text-white rounded" onClick={() => setStep(2)}>Next</button> */}
            <button
                className="mt-4 px-4 py-2 mx-12 bg-blue-500 text-white rounded"
                onClick={() => {
                   if (!employment) {
                     toast.warning("Please select your employment status.");
                    return;
                  }
                   setStep(2);
                 }}
              >
                Next
             </button>
          </>
        )}

{/* STEP 2 — Industry */}
{step === 2 && (
  <>
    <p className="font-semibold text-4xl text-center mt-6">
      What is your occupation/industry?
    </p>
    <div className="flex justify-center mt-3">
      <div className="border border-gray-400 w-full max-w-md md:max-w-lg rounded-md flex flex-col divide-y divide-gray-400 p-2 overflow-y-auto max-h-96">
        {[
          "Accountancy",
          "Admin / Secretarial",
          "Agriculture",
          "Catering / Hospitality",
          "Marketing / PR",
          "Education",
          "Engineering",
          "Financial Services",
          "Healthcare",
          "HR",
          "IT",
          "Others"
        ].map((item) => (
          <h2
            key={item}
            className={`p-3 cursor-pointer font-semibold text-center hover:bg-blue-100 ${
              industry === item ? "bg-blue-200" : ""
            }`}
            onClick={() => setIndustry(item)}
          >
            {item}
          </h2>
        ))}
      </div>
    </div>
    <div className="flex justify-between mt-4 mx-4 md:mx-0">
      <button
        onClick={() => setStep(1)}
        className="px-4 py-2 border rounded"
      >
        Back
      </button>
      {/* <button
        onClick={() => setStep(3)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button> */}
      <button onClick={() => {if (!industry) {
      toast.warning("Please select your occupation.");
      return;
    }
    setStep(3);
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Next
</button>

    </div>
  </>
)}


        {/* STEP 3 — Experience */}
        {step === 3 && (
          <>
            <p className="font-semibold text-2xl text-center mt-6">Do you have previous trading experience?</p>
            <div className="flex justify-center mt-6">
              <div className="border border-gray-400 w-96 rounded-md flex flex-col divide-y divide-gray-400">
                {["Yes, I have less than 1 year of trading experince", "Yes, I have 1+ years of trading experience", "Yes, I have 2+ years of trading experience", "Yes, I have 4+ years of trading experience", "No, I have no trading experince"].map(item => (
                  <h2
                    key={item}
                    className={`p-4 text-center font-semibold cursor-pointer hover:bg-blue-100 ${experience === item ? "bg-blue-200" : ""}`}
                    onClick={() => setExperience(item)}
                  >
                    {item}
                  </h2>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(2)} className="px-4 py-2 border rounded">Back</button>
              {/* <button onClick={() => setStep(4)} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button> */}
              <button
  onClick={() => {
    if (!experience) {
      toast.warning("Please select experience level.");
      return;
    }
    setStep(4);
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Next
</button>

            </div>
          </>
        )}

        {/* STEP 4 — Income */}
        {step === 4 && (
          <>
            <p className="font-semibold text-2xl text-center mt-6">What is your annual income?</p>
            <div className="flex justify-center mt-6">
              <div className="border border-gray-400 w-80 rounded-md flex flex-col divide-y divide-gray-400">
                {["$0 - $20,000", "$20,000 - $50,000", "$50,000 - $100,000", "$100,000 - $200,000", "More than $200,000"].map(item => (
                  <h2
                    key={item}
                    className={`p-4 text-center font-semibold cursor-pointer hover:bg-blue-100 ${income === item ? "bg-blue-200" : ""}`}
                    onClick={() => setIncome(item)}
                  >
                    {item}
                  </h2>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(3)} className="px-4 py-2 border rounded">Back</button>
              {/* <button onClick={() => setStep(5)} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button> */}
              <button
  onClick={() => {
    if (!income) {
      toast.warning("Please select income range.");
      return;
    }
    setStep(5);
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Next
</button>

            </div>
          </>
        )}

        {/* STEP 5 — Wealth */}
        {step === 5 && (
          <>
            <p className="font-semibold text-2xl text-center mt-6">What is your total wealth?</p>
            <div className="flex justify-center mt-6">
              <div className="border border-gray-400 w-80 rounded-md flex flex-col divide-y divide-gray-400">
                {["Savings", "Employment / Business Proceeds", "Rent", "Borrowed Fund / Loan", "Pension", "Inheritance"].map(item => (
                  <h2
                    key={item}
                    className={`p-4 text-center font-semibold cursor-pointer hover:bg-blue-100 ${wealth === item ? "bg-blue-200" : ""}`}
                    onClick={() => setWealth(item)}
                  >
                    {item}
                  </h2>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(4)} className="px-4 py-2 border rounded">Back</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 justify-center mt-4">
          <img src={btnlogo} alt="" className="w-6 h-6" />
          <p className="text-sm">All data is encrypted for security purposes</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
