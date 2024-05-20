import { Events, Users } from '../mongo/esquemas.js';
import cron from 'node-cron';

async function deleteOldEvents() {
    try {
      // Defina a data atual e a data há uma semana
      const currentDate = new Date();
      const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      console.log('aqui1');
      // Encontre os eventos que têm mais de uma semana
      const oldEvents = await Events.find({ BegDate: { $lt: oneWeekAgo } });
      console.log('aqui2');
      // Exclua os eventos antigos
      for (const event of oldEvents) {
        console.log('Deleting old event:', event._id);
        await Users.findByIdAndUpdate(event.Creator, { $pull: { EventCreator: event._id } });
        await Events.findByIdAndDelete(event._id);
      }
    } catch (error) {
      console.error('Error deleting old events:', error);
    }
}

// Função para inicializar o cronjob
export default function initCronjob() {
    console.log('Inicializando cronjob...');
    // Execute a função deleteOldEvents a cada dia à meia-noite
    cron.schedule('0 0 * * *', async () => {
        await deleteOldEvents();
    }, {
        timezone: 'Europe/Lisbon' 
    });
}