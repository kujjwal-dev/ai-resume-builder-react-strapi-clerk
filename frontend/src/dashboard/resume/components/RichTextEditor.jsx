import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { 
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Separator,
} from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { AIChatSession } from '../../../../service/AIModal'

const prompt= 'position title: {positionTitle} , Depends on position title gimme 5-7 bullet points for my experience in resume , gimme result in html format.'

export default function RichTextEditor({onRichTextEditorChange,index}) {
  const [value, setValue] = useState();
  const {resumeInfo,setResumeInfo} = useContext(ResumeInfoContext);
  const [loading,setLoading] = useState(false);

  function onChange(e) {
    setValue(e.target.value);
    onRichTextEditorChange(e)
  }


  const GenerateSummeryFromAI=async()=> {
    if (!resumeInfo.experience[index].title) {
      toast.error('Position title is required to generate summary');
      return;
    }
    setLoading(true);
    const PROMPT = prompt.replace('{positionTitle}', resumeInfo.experience[index].title);
    console.log('PROMPT:', PROMPT);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      console.log(result.response.text());
      const resp = result.response.text()
      setValue(resp.replace('[','').replace(']',''));
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary from AI');
    } finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summery</label>
        <Button variant='outline' size='sm'
         className='flex gap-2 border-primary text-primary ' onClick={GenerateSummeryFromAI}>
         {loading ? 
         <LoaderCircle className='animate-spin'/>  : 
         <>
          <Brain className='h-4 w-4'/> Generate from AI </>
          } 
          </Button>
      </div>
    <EditorProvider>
      <Editor value={value} onChange={onChange}  >
        <Toolbar>
        <BtnUndo />
          <BtnRedo />
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnLink />
        </Toolbar>
      </Editor>
    </EditorProvider>
    </div>
  );
}