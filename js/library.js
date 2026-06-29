const advancedFilters=document.querySelector('[data-advanced-filters]');
if(advancedFilters){
  const cards=[...document.querySelectorAll('.game-card')];
  const fields=[...advancedFilters.querySelectorAll('select,input')];
  const apply=()=>{
    const values=Object.fromEntries(fields.map(f=>[f.name,(f.value||'').toLowerCase()]));
    cards.forEach(card=>{
      const text=card.textContent.toLowerCase();
      const okSearch=!values.search||text.includes(values.search);
      const okCategory=!values.category||card.dataset.category===values.category;
      const okYear=!values.year||card.dataset.year===values.year;
      const okTime=!values.time||card.dataset.time===values.time;
      const okType=!values.type||card.dataset.type?.includes(values.type);
      card.hidden=!(okSearch&&okCategory&&okYear&&okTime&&okType);
    });
  };
  fields.forEach(field=>field.addEventListener('input',apply));
  advancedFilters.querySelector('[data-clear-filters]')?.addEventListener('click',()=>{fields.forEach(f=>f.value='');apply();});
}

const lessonForm=document.querySelector('[data-lesson-form]');
if(lessonForm){
  const output=document.querySelector('[data-lesson-output]');
  lessonForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const data=Object.fromEntries(new FormData(lessonForm));
    output.textContent=`PLANO DE AULA — ${data.game||'Jogo matemático'}\n\nAno/Série: ${data.year||'A definir'}\nDuração: ${data.time||'50 minutos'}\nConteúdo: ${data.content||'Conteúdo matemático indicado'}\n\nObjetivo da aula:\n${data.goal||'Promover a aprendizagem matemática por meio de uma experiência lúdica, investigativa e colaborativa.'}\n\nOrganização da turma:\nDividir os estudantes em grupos, apresentar as regras e combinar o registro das estratégias utilizadas.\n\nDesenvolvimento:\n1. Apresentar o problema/jogo e retomar conhecimentos prévios.\n2. Realizar uma primeira rodada para familiarização.\n3. Acompanhar os grupos, fazendo perguntas e observando estratégias.\n4. Promover discussão coletiva sobre decisões, erros, possibilidades e conceitos matemáticos.\n\nPerguntas para discussão:\n- Que estratégia ajudou mais durante o jogo?\n- Que conceito matemático apareceu nas jogadas?\n- O que poderia ser alterado nas regras?\n- Como justificar matematicamente uma decisão tomada?\n\nAvaliação:\nObservar participação, argumentação, registros, tomada de decisão e capacidade de relacionar o jogo ao conteúdo estudado.`;
  });
}

const newsTabs=document.querySelectorAll('[data-news-category]');
if(newsTabs.length){
  const newsCards=[...document.querySelectorAll('[data-news-card]')];
  newsTabs.forEach(tab=>tab.addEventListener('click',()=>{
    newsTabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const category=tab.dataset.newsCategory;
    newsCards.forEach(card=>{card.hidden=category!=='todos'&&card.dataset.category!==category;});
  }));
}
