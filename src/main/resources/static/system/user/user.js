$(document).ready(function () {
    // 初始化dataTables，并加载数据
    var table = $("#dataTable").DataTable({
        "paging": true,         //开启表格分页
        "lengthChange": false, //是否允许用户改变表格每页显示的记录数
        "searching": false,    //禁用搜索
        "ordering": false,     //全局禁用排序
        "deferRender": true,   //延迟渲染
        "autoWidth": false,    //开启自适应宽度
        "processing": true,
        "serverSide": true,
        "language": {
            "url": "/static/AdminLTE-2.3.11/plugins/datatables/i18n/Chinese.json"
        },
        "ajax": {
            "url": "/api/user/listByPage",
            "type": "POST",
            "data": function (d) {
                d.enabled=$("#enabled").val();
                d.username=$("#username").val().trim();
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "username" },
            { "data": "userNameCn" },
            { "data": "userNameEn" },
            {
                "data": "enabled" ,
                "render" : function(data, type, full, meta) {
                    if(data == 1){
                        data ="<span class='label label-primary'>可用</span>";
                    }else{
                        data ="<span class='label label-danger'>不可用</span>";
                    }
                    return	 data;
                }
            },
            { "data": "remarks" },
            {
                "data" : null,
                "render":function(data, type, row, meta){
                    return	data='<button class="btn btn-primary btn-xs" id="deleteOne" title="删除" data-id='+ row.id +'><i class="glyphicon glyphicon-trash"></i></button> ' +
                        '<button class="btn btn-primary btn-xs" id="editOne" title="编辑"  data-id='+ row.id +'><i class="glyphicon glyphicon-edit"></i></button> ' +
                        '<button class="btn btn-primary btn-xs" id="detailOne" title="详情" data-id='+ row.id +'><i class="glyphicon glyphicon-th"></i></button> ';
                }
            }
        ],
    });

    // 打开添加页面
    $(document).delegate('#addOne','click',function() {
        window.open("/api/user/add","_self");
    });
    // 打开编辑页面
    $(document).delegate('#editOne','click',function() {
        var id=$(this).data("id");
        window.open("/api/user/edit/"+id,"_self");
    });
    // 打开详情页面
    $(document).delegate('#detailOne','click',function() {
        var id = $(this).data("id");
        var index = layer.open({
            type: 2,
            title: '用户详情',
            shadeClose: false,
            shade: 0.8,
            maxmin: true, //开启最大化最小化按钮
            area: ['600px', '380px'],
            content: '/api/user/detail/' + id
        });
    });
    // 重置查询条件
    $(document).delegate('#reset','click',function() {
        $("#username").val("");
        $("#enabled").val("");
    });
    // 查询操作
    $(document).delegate('#search','click',function() {
        table.ajax.reload();
    });
    //单行删除操作
    $(document).delegate('#deleteOne','click',function() {
        var id = $(this).data("id");
        layer.confirm('您确定要删除当前信息吗？', {icon: 3, title:'提示信息'}, function(index) {
            $.ajax({
                url: "/api/user/" + id,
                async: true,
                type: "DELETE",
                dataType: "json",
                cache: false,    //不允许缓存
                success: function(data) {
                    if (data.code == 0) {
                        layer.msg("删除成功", {icon: 1, time: 2000});
                    }else {
                        layer.msg("删除失败", {icon: 2, time: 2000});
                    }
                    table.ajax.reload();
                    layer.close(index);
                },
                error: function () {
                    layer.msg("数据异常", {time: 1500},function(){
                        layer.close(index);
                    });
                }
            });
        });
    });
});