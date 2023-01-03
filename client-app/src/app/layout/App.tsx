import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponents from './loadingComponents';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activitites.list().then(response => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity)
        })
        setActivities(activities);
        setLoading(false);
      })
  }, [])

  function handleSelectActivity(id: string){
      setSelectedActivity(activities.find(x => x.id == id))
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }
  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateorEditActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id){
      agent.Activitites.update(activity).then(()=>{
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }else {
      activity.id = uuid();
      agent.Activitites.create(activity).then (()=> {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);

      })
    }
  }
  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activitites.delete(id).then(()=> {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponents content ='Loading app'/>

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
        activities={activities} 
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEdit={handleCreateorEditActivity}
        deleteActivity={handleDeleteActivity}
        submitting = {submitting}
        />
      </Container>
    </>
  );
}

export default App;
