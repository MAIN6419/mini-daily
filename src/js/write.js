
const editor = new toastui.Editor({
  el: document.querySelector('#editor'),
  previewStyle: 'vertical',
  width: '500px',
  height: '500px',
  initialEditType: 'wysiwyg',
  initialValue: '<p></p>'
});
let data = [];
if(localStorage.getItem('data')){
  data = JSON.parse(localStorage.getItem('data'));
}
const $inputTitle = document.querySelector(".input-title");
const $submitBtn = document.querySelector(".btn-submit");
const regex = /^\s*(?!(<[^>]*>|&nbsp;|\s))[^<>]*\S.*$/;
$inputTitle.addEventListener('input', (e)=>{
  e.target.value = e.target.value.trim();
})
$submitBtn.addEventListener('click', ()=>{
  // 유효성 검사
  const contents = editor.getHTML().replace(/<[^>]+>/g, '');
  const isEmpty = regex.test(contents);
  if(!$inputTitle.value){
    alert("제목을 입력해주세요!");
    return;
  }
  if(!isEmpty){
    alert("내용을 입력해주세요!");
    return;
  }
  if(confirm("정말 작성하시겠습니까?")){
    const id = uuid.v4();
    const newPost = {
      id,
      title: $inputTitle,
      contents: DOMPurify.sanitize(contents, { ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'p', 'strong', 'u']}),
      createdAt : new Date().getTime(),
    }
    console.log(data);
    data.push(newPost);
    localStorage.setItem('data',JSON.stringify(data));
  }
})


