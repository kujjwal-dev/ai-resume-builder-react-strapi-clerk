import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { Brain, Loader, LoaderCircle } from 'lucide-react';
import { AIChatSession } from '../../../../../service/AIModal'

const prompt = 'job Title: {jobTitle} , Depends on job title gimme summery for my resume within 4-5 lines in json format with field expirence level and summery. in which give summery for experience level Fresher , Mid-Level and Experienced'

const Summary = ({ enabledNext }) => {

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState([]);

  useEffect(() => {
    summery && setResumeInfo({
      ...resumeInfo,
      summery: summery
    })
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error('Job title is required to generate summary');
      return;
    }

    setLoading(true);

    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
    console.log('PROMPT:', PROMPT);

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      console.log("ersult", result)
      const parsedResult = JSON.parse(result.response.text());
      console.log(parsedResult);
      setAiGeneratedSummeryList(parsedResult.experience_levels || []);

    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary from AI');
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true)
    const data = {
      data: {
        summery: summery
      }
    }
    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then((response) => {
      console.log(response);
      enabledNext(true);
      setLoading(false);
      toast("Details updated")
    }, (error) => {
      setLoading(false)
    })


  }

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>
        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button variant='outline' onClick={() => GenerateSummeryFromAI()} type="button" className=" size='sm' border-primary text-primary "><Brain className='h-4  w-4' /> Generate from AI</Button>
          </div>
          <Textarea className='mt-5' required
            onChange={(e) => setSummery(e.target.value)} />
          <div className='mt-3 flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'
              }</Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList.length>0 && <div>
        <h2 className='font-bold text-lg'>Suggestions</h2>
        {aiGeneratedSummeryList.map((item,index) => (
          <div key={index}>
            <h2 className='font-bold my-1'> Level: {item?.experience_level} </h2>
            <p>{item?.summary}</p>
            </div>
        ))}
      </div>}

    </div>
  )
}

export default Summary