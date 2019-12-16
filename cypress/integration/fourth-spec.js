describe('测试POST API', () => {
    const item = {"id":291, "title": "kevin", "name": "kevin" }
  
    it('POST会新增一个用户', () => {
      //检查user内容增加了
      cy.request('/user').then((res)=>{
        expect(res.status).to.be.equal(200)
      })
  
      cy.request({
        method: 'POST',
        //添加 user 信息
        url: '/user',
        headers: {'Content-Type': 'application/json'},
        body: item
      })
    })
  })