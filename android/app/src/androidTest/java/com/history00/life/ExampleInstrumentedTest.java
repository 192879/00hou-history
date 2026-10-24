package com.history00.life;

import static org.junit.Assert.*;

import android.content.Context;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {

    @Test
    public void useAppContext() throws Exception {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();

        assertEquals("com.history00.life", appContext.getPackageName());
    }

    @Test
    public void packagedGameStartsOffline() throws Exception {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                appContext.getAssets().open("public/index.html")))) {
            String html = reader.lines().collect(Collectors.joining("\n"));
            assertTrue(html.contains("00后渡劫模拟器"));
            assertTrue(html.contains("src/platform/bootstrap.js"));
        }
    }
}
