<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function controllerMethod(){
        return response()->json([
            'msg' => 'We will only return json data'
        ]);
    }

    public function test() {
        return response()->json([
            'msg' => 'some error occured'
        ], 422);
    }
}
