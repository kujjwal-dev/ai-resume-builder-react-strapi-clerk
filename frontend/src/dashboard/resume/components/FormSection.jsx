import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LayoutGrid } from 'lucide-react'

const FormSection = () => {
  const[activeFormIndex,setActiveFormIndex] = useState(1);
  const[enableNext,setEnableNext]=useState(false);
  return (
    <div>
      <div className='flex justify-between items-center'>
        <Button variant="outline" size="sm" className="flex gap-2"><LayoutGrid />Theme</Button>
        <div className='flex gap-2'>
          {activeFormIndex>1 
          && 
          <Button size="sm" className="" 
          onClick={() => setActiveFormIndex(activeFormIndex-1)}><ArrowLeft/>Previous</Button>}
          <Button 
          disabled={!enableNext}
          className="flex gap-2" size="sm" 
          onClick={() => setActiveFormIndex(activeFormIndex+1)}>Next</Button>
        </div>
      </div>
      {/* Personal Detail Form */}

     {activeFormIndex==1? <PersonalDetail enabledNext={(v) => setEnableNext(v)} /> : null}

      {/* Sumamry */}

      {/* Experience */}


      {/* Educatioanl Detail */}


      {/* Skills */}



    </div>
  )
}

export default FormSection