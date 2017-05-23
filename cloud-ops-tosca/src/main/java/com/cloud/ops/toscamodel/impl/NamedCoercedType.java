/*
 * Copyright 2015 Universita' di Pisa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.cloud.ops.toscamodel.impl;

import com.cloud.ops.toscamodel.ICoercedType;
import com.cloud.ops.toscamodel.IConstraint;
import com.cloud.ops.toscamodel.INamedEntity;
import com.cloud.ops.toscamodel.IType;

import java.util.Collections;

/**
 * Created by pq on 20/04/2015.
 */
public class NamedCoercedType extends CoercedType implements INamedEntity {
    final String name;

    public NamedCoercedType(String name,ICoercedType baseType) {
        super(baseType.baseType(), baseType.getConstraints());
        this.name = name;
    }

    @Override
    public IType coerce(IConstraint constraint) {
        return new CoercedType(this, Collections.singleton(constraint));
    }

    @Override
    public String name() {
        return name;
    }
}
