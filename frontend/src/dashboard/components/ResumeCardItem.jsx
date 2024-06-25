import { Notebook } from "lucide-react";
import { Link } from "react-router-dom";

const ResumeCardItem = ({ resume }) => {
    console.log(resume); // Check if resume object is correctly passed
    const { resumeId, title, userEmail, userName } = resume.attributes;
    console.log(title, userEmail, userName); // Check if attributes are correctly accessed
  
    return (
      <Link to={'/dashboard/resume/'+ resume.id+"/edit"} >
        <div className='p-14 py-24 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary  '>
          <Notebook size='48' />
        </div>
        <h2 className="text-center my-1">{title}</h2>
    
      </Link>
    );
  };

  export default ResumeCardItem;
  